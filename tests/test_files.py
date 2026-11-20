import os
import tempfile
import unittest
from unittest import mock

from liv import files


class TestFiles(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = os.path.realpath(self.temporary.name)

    def tearDown(self):
        for directory, _, names in os.walk(self.root):
            os.chmod(directory, 0o700)
        self.temporary.cleanup()

    def book(self, name, data=None):
        path = os.path.join(self.root, name)
        if data is not None:
            with open(path, "wb") as handle:
                handle.write(data)
        return path

    def content(self, path):
        with open(path, "rb") as handle:
            return handle.read()

    def test_realpath_1(self):
        os.makedirs(os.path.join(self.root, "w", "x"))
        os.makedirs(os.path.join(self.root, "w", "y"))
        self.assertEqual(files.realpath(os.path.join(self.root, "w", "x", "..", "y")), os.path.join(self.root, "w", "y"))

    def test_realpath_2(self):
        with self.assertRaises(OSError) as failure:
            files.realpath(os.path.join(self.root, "w", "missing"))
        self.assertEqual(failure.exception.strerror, "No such file or directory")

    def test_append_1(self):
        book = self.book("q.mtsv", b"\fs\na\n1\t2")
        files.append(book, b"", b"3\n")
        other = self.book("r.mtsv", b"\fs\na\n1\t2")
        files.append(other, b"", b"")
        self.assertEqual([self.content(book).endswith(b"1\t2\n3\n"), self.content(other)], [True, b"\fs\na\n1\t2"])

    def test_append_2(self):
        book = self.book("q.mtsv", b"\fs\na\n1\n")
        files.append(book, b"", b"2\n")
        self.assertTrue(self.content(book).endswith(b"1\n2\n"))

    def test_append_3(self):
        book = os.path.join(self.root, "a", "b", "q.mtsv")
        files.append(book, b"\fs\na\n1\n", b"1\n")
        first = [os.path.isdir(os.path.join(self.root, "a")), os.path.isdir(os.path.join(self.root, "a", "b"))]
        other = os.path.join(self.root, "c", "b", "q.mtsv")
        real_mkdir = os.mkdir

        def another_writer(path, mode=0o777, **kwargs):
            if path == os.path.join(self.root, "c", "b"):
                real_mkdir(path, mode)
            real_mkdir(path, mode)

        with mock.patch("os.mkdir", side_effect=another_writer):
            files.append(other, b"\fs\na\n1\n", b"1\n")
        self.assertEqual(first + [os.path.exists(book), os.path.exists(other)], [True, True, True, True])

    def test_append_4(self):
        book = os.path.join(self.root, "q.mtsv")
        mask = os.umask(0o022)
        try:
            files.append(book, b"\fs\na\n1\n", b"1\n")
        finally:
            os.umask(mask)
        self.assertEqual([self.content(book), os.stat(book).st_mode & 0o7777], [b"\fs\na\n1\n", 0o644])

    def test_append_5(self):
        book = os.path.join(self.root, "q.mtsv")
        real_link = os.link

        def another_writer(source, destination):
            with open(destination, "wb") as handle:
                handle.write(b"\fs\na\n")
            real_link(source, destination)

        with mock.patch("os.link", side_effect=another_writer):
            files.append(book, b"\fs\na\n1\n", b"1\n")
        data = self.content(book)
        self.assertEqual([data.count(b"\fs\na\n"), data.endswith(b"1\n")], [1, True])

    def test_append_6(self):
        book = os.path.join(self.root, "q.mtsv")
        files.append(book, b"\fs\na\n1\n", b"1\n")
        self.assertEqual(os.listdir(self.root), ["q.mtsv"])

    def test_append_7(self):
        book = os.path.join(self.root, "q.mtsv")
        with mock.patch("os.write", return_value=3):
            with self.assertRaises(OSError) as failure:
                files.append(book, b"\fs\na\n", b"")
        self.assertEqual([str(failure.exception), os.listdir(self.root)], ["short write", []])

    def test_read_1(self):
        self.assertEqual(files.read(os.path.join(self.root, "missing.mtsv")), b"")

    def test_read_2(self):
        self.assertEqual(files.read(self.book("q.mtsv", b"\fs\na\n1\n")), b"\fs\na\n1\n")

    def test_read_3(self):
        os.makedirs(os.path.join(self.root, "closed"))
        book = os.path.join(self.root, "closed", "q.mtsv")
        os.chmod(os.path.join(self.root, "closed"), 0)
        with self.assertRaises(OSError) as failure:
            files.read(book)
        self.assertEqual(failure.exception.strerror, "Permission denied")
