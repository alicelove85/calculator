#!/usr/bin/env python3
"""Solid-color PNG for PWA (stdlib only). Teal #0d9488."""
import struct
import zlib


def write_png(path: str, width: int, height: int, r: int, g: int, b: int) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    raw = bytearray()
    row = bytes([r, g, b]) * width
    for _ in range(height):
        raw.append(0)
        raw.extend(row)
    compressed = zlib.compress(bytes(raw), 9)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", compressed)
        + chunk(b"IEND", b"")
    )
    with open(path, "wb") as f:
        f.write(png)


if __name__ == "__main__":
    for size in (180, 192, 512):
        write_png(f"icon-{size}.png", size, size, 0x0D, 0x94, 0x88)
    print("Wrote icon-180.png, icon-192.png, icon-512.png")
