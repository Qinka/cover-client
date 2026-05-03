export interface ElfInfo {
  arch: string;
  is_64bit: boolean;
  is_little_endian: boolean;
  elf_type: string;
  entry: bigint;
  size: number;
  is_packed: boolean;
}

export type LibcType = 'musl' | 'gnu';

export interface PackConfig {
  compressionLevel: number;
  libc: LibcType;
}
