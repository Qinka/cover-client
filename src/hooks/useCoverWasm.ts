import { analyze, pack } from '../wasm/cover_wasm';
import type { ElfInfo } from '../types/cover.ts';

export type WasmStatus = 'idle' | 'loading' | 'ready' | 'error';

// Module-level singleton so the WASM instance is initialised once
let _status: WasmStatus = 'idle';
let _error: string | null = null;
let _ready = false;

async function ensureReady(): Promise<void> {
  if (_ready) return;
  if (_status === 'error') throw new Error(_error ?? 'WASM error');
  _status = 'loading';
  try {
    // WASM is loaded eagerly via static import
    _ready = true;
    _status = 'ready';
  } catch (e) {
    _error = e instanceof Error ? e.message : String(e);
    _status = 'error';
    throw e;
  }
}

export function useCoverWasm() {
  async function initWasm(): Promise<void> {
    await ensureReady();
  }

  async function analyzeElf(bytes: Uint8Array): Promise<ElfInfo> {
    await ensureReady();
    return analyze(bytes) as ElfInfo;
  }

  async function packElf(bytes: Uint8Array, compressionLevel: number, libc: string): Promise<Uint8Array> {
    await ensureReady();
    console.dir({ compressionLevel, libc });
    return pack(bytes, compressionLevel, libc);
  }

  return {
    initWasm,
    analyzeElf,
    packElf,
    get status() { return _status; },
    get error() { return _error; },
  };
}

export type { ElfInfo };
