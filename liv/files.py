import os
import stat

from .types import uuid4

BASE_DIRECTORY = "liv"
# /interface/files append 1
# POSIX-XSH-FSTAT /DESCRIPTION/1 to /DESCRIPTION/1
# POSIX-XSH-READ /DESCRIPTION/24 to /DESCRIPTION/24
# POSIX-XSH-READ /ERRORS/4 to /ERRORS/5
# PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/fstat(fd)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/fstat(fd)/1
# PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/pread(fd, n, offset, /)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/pread(fd, n, offset, /)/2
LF = b"\n"
# /interface/files append 7
# POSIX-XSH-WRITE /DESCRIPTION/9 to /DESCRIPTION/9
# POSIX-XSH-WRITE /RETURN VALUE/1 to /RETURN VALUE/1
# PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/2 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/2
SHORT_WRITE = "short write"
# /interface/files append 3
# POSIX-XSH-MKDIR /DESCRIPTION/1 to /DESCRIPTION/1
# POSIX-XSH-MKDIR /ERRORS/1 to /ERRORS/5
# PY-OS /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/1 to /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/2
# PY-OS /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/3 to /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/3
EVERY_PERMISSION_BIT = 0o777
# /interface/files append 4
# POSIX-XSH-OPEN /DESCRIPTION/23 to /DESCRIPTION/24
# POSIX-XSH-OPEN /DESCRIPTION/29 to /DESCRIPTION/30
# POSIX-XSH-LINK /DESCRIPTION/1 to /DESCRIPTION/2
# POSIX-XBD-DEFS /3.264 Portable Filename/1 to /3.265 Portable Filename Character Set/5
# POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
# PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1
# PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/1
# PY-OS /os --- Miscellaneous operating system interfaces/Files and Directories/link(src, dst, *, src_dir_fd=None, dst_dir_fd=None, follow_symlinks=True)/1 to /os --- Miscellaneous operating system interfaces/Files and Directories/link(src, dst, *, src_dir_fd=None, dst_dir_fd=None, follow_symlinks=True)/1
# POSIX-XSH-FOPEN /DESCRIPTION/26 to /DESCRIPTION/26
# POSIX-XBD-SYS-STAT /DESCRIPTION/58 to /DESCRIPTION/70
S_IRUSR = stat.S_IRUSR
S_IWUSR = stat.S_IWUSR
S_IRGRP = stat.S_IRGRP
S_IWGRP = stat.S_IWGRP
S_IROTH = stat.S_IROTH
S_IWOTH = stat.S_IWOTH


def realpath(directory):
    # /interface/files realpath 1
    # POSIX-XSH-REALPATH /DESCRIPTION/1 to /DESCRIPTION/1
    # PY-OS-PATH /os.path --- Common pathname manipulations/realpath(path, /, *, strict=False)/1 to /os.path --- Common pathname manipulations/realpath(path, /, *, strict=False)/2
    # /interface/files realpath 2
    # PY-OS-PATH /os.path --- Common pathname manipulations/realpath(path, /, *, strict=False)/5 to /os.path --- Common pathname manipulations/realpath(path, /, *, strict=False)/5
    return os.path.realpath(directory, strict=True)


def _write_whole(descriptor, data):
    # /interface/files append 7
    # POSIX-XSH-WRITE /DESCRIPTION/9 to /DESCRIPTION/9
    # POSIX-XSH-WRITE /RETURN VALUE/1 to /RETURN VALUE/1
    # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/2 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/2
    if os.write(descriptor, data) != len(data):
        raise OSError(SHORT_WRITE)


def _add(descriptor, records_bytes):
    # /interface/files append 1
    # POSIX-XSH-FSTAT /DESCRIPTION/1 to /DESCRIPTION/1
    # POSIX-XSH-READ /DESCRIPTION/24 to /DESCRIPTION/24
    # POSIX-XSH-READ /ERRORS/4 to /ERRORS/5
    # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/fstat(fd)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/fstat(fd)/1
    # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/pread(fd, n, offset, /)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/pread(fd, n, offset, /)/2
    size = os.fstat(descriptor).st_size
    if records_bytes and size and os.pread(descriptor, 1, size - 1) != LF:
        records_bytes = LF + records_bytes
    # /interface/files append 2
    # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
    # POSIX-XSH-OPEN /DESCRIPTION/17 to /DESCRIPTION/18
    # POSIX-XSH-WRITE /DESCRIPTION/5 to /DESCRIPTION/5
    # POSIX-XSH-CHAP02 /2.9 Threads/2.9.7 Thread Interactions with File Operations/4 to /2.9 Threads/2.9.7 Thread Interactions with File Operations/6
    # POSIX-XSH-OPEN /DESCRIPTION/10 to /DESCRIPTION/11
    # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/2
    _write_whole(descriptor, records_bytes)


def _open_existing(book):
    # /interface/files append 2
    # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
    # POSIX-XSH-OPEN /DESCRIPTION/17 to /DESCRIPTION/18
    # POSIX-XSH-WRITE /DESCRIPTION/5 to /DESCRIPTION/5
    # POSIX-XSH-CHAP02 /2.9 Threads/2.9.7 Thread Interactions with File Operations/4 to /2.9 Threads/2.9.7 Thread Interactions with File Operations/6
    # POSIX-XSH-OPEN /DESCRIPTION/10 to /DESCRIPTION/11
    # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/2
    return os.open(book, os.O_RDWR | os.O_APPEND)


def append(book, sheet_bytes, records_bytes):
    # /interface/files append 2
    # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
    # POSIX-XSH-OPEN /DESCRIPTION/17 to /DESCRIPTION/18
    # POSIX-XSH-WRITE /DESCRIPTION/5 to /DESCRIPTION/5
    # POSIX-XSH-CHAP02 /2.9 Threads/2.9.7 Thread Interactions with File Operations/4 to /2.9 Threads/2.9.7 Thread Interactions with File Operations/6
    # POSIX-XSH-OPEN /DESCRIPTION/10 to /DESCRIPTION/11
    # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/2
    try:
        descriptor = _open_existing(book)
    except FileNotFoundError:
        descriptor = None
    if descriptor is not None:
        try:
            _add(descriptor, records_bytes)
        finally:
            os.close(descriptor)
        return
    # /interface/files append 3
    # POSIX-XSH-MKDIR /DESCRIPTION/1 to /DESCRIPTION/1
    # POSIX-XSH-MKDIR /ERRORS/1 to /ERRORS/5
    # PY-OS /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/1 to /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/2
    # PY-OS /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/3 to /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/3
    directory = os.path.dirname(book)
    os.makedirs(directory, EVERY_PERMISSION_BIT, exist_ok=True)
    # /interface/files append 4
    # POSIX-XSH-OPEN /DESCRIPTION/23 to /DESCRIPTION/24
    # POSIX-XSH-OPEN /DESCRIPTION/29 to /DESCRIPTION/30
    # POSIX-XSH-LINK /DESCRIPTION/1 to /DESCRIPTION/2
    # POSIX-XBD-DEFS /3.264 Portable Filename/1 to /3.265 Portable Filename Character Set/5
    # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
    # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1
    # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/1
    # PY-OS /os --- Miscellaneous operating system interfaces/Files and Directories/link(src, dst, *, src_dir_fd=None, dst_dir_fd=None, follow_symlinks=True)/1 to /os --- Miscellaneous operating system interfaces/Files and Directories/link(src, dst, *, src_dir_fd=None, dst_dir_fd=None, follow_symlinks=True)/1
    # POSIX-XSH-FOPEN /DESCRIPTION/26 to /DESCRIPTION/26
    # POSIX-XBD-SYS-STAT /DESCRIPTION/58 to /DESCRIPTION/70
    new_file = os.path.join(directory, uuid4())
    descriptor = os.open(new_file, os.O_WRONLY | os.O_CREAT | os.O_EXCL, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH)
    try:
        try:
            # /interface/files append 7
            # POSIX-XSH-WRITE /DESCRIPTION/9 to /DESCRIPTION/9
            # POSIX-XSH-WRITE /RETURN VALUE/1 to /RETURN VALUE/1
            # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/2 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/2
            _write_whole(descriptor, sheet_bytes)
        finally:
            os.close(descriptor)
        # /interface/files append 4
        # POSIX-XSH-OPEN /DESCRIPTION/23 to /DESCRIPTION/24
        # POSIX-XSH-OPEN /DESCRIPTION/29 to /DESCRIPTION/30
        # POSIX-XSH-LINK /DESCRIPTION/1 to /DESCRIPTION/2
        # POSIX-XBD-DEFS /3.264 Portable Filename/1 to /3.265 Portable Filename Character Set/5
        # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
        # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1
        # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/write(fd, str, /)/1
        # PY-OS /os --- Miscellaneous operating system interfaces/Files and Directories/link(src, dst, *, src_dir_fd=None, dst_dir_fd=None, follow_symlinks=True)/1 to /os --- Miscellaneous operating system interfaces/Files and Directories/link(src, dst, *, src_dir_fd=None, dst_dir_fd=None, follow_symlinks=True)/1
        # POSIX-XSH-FOPEN /DESCRIPTION/26 to /DESCRIPTION/26
        # POSIX-XBD-SYS-STAT /DESCRIPTION/58 to /DESCRIPTION/70
        try:
            os.link(new_file, book)
            linked = True
        # /interface/files append 5
        # POSIX-XSH-LINK /ERRORS/4 to /ERRORS/5
        # POSIX-XSH-LINK /DESCRIPTION/6 to /DESCRIPTION/6
        except FileExistsError:
            linked = False
    finally:
        # /interface/files append 6
        # POSIX-XSH-UNLINK /DESCRIPTION/1 to /DESCRIPTION/1
        # PY-OS /os --- Miscellaneous operating system interfaces/Files and Directories/unlink(path, *, dir_fd=None)/1 to /os --- Miscellaneous operating system interfaces/Files and Directories/unlink(path, *, dir_fd=None)/1
        os.unlink(new_file)
    if not linked:
        # /interface/files append 5
        # POSIX-XSH-LINK /ERRORS/4 to /ERRORS/5
        # POSIX-XSH-LINK /DESCRIPTION/6 to /DESCRIPTION/6
        descriptor = _open_existing(book)
        try:
            _add(descriptor, records_bytes)
        finally:
            os.close(descriptor)


def read(book):
    # /interface/files read 1
    # POSIX-XSH-OPEN /ERRORS/22 to /ERRORS/23
    # /interface/files read 3
    try:
        descriptor = os.open(book, os.O_RDONLY)
    except FileNotFoundError:
        return b""
    # /interface/files read 2
    # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
    # POSIX-XSH-READ /DESCRIPTION/1 to /DESCRIPTION/5
    # POSIX-XSH-READ /RETURN VALUE/1 to /RETURN VALUE/1
    chunks = []
    try:
        while True:
            chunk = os.read(descriptor, 65536)
            if not chunk:
                break
            chunks.append(chunk)
    finally:
        os.close(descriptor)
    return b"".join(chunks)
