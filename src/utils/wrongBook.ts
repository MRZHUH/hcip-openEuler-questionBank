const KEY_MAP: Record<string, string> = {
  openeuler: 'wrongBook:openeuler',
  opengauss: 'wrongBook:opengauss',
}

function read(source: 'openeuler' | 'opengauss'): number[] {
  const key = KEY_MAP[source]
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) return arr.filter((x) => typeof x === 'number')
    return []
  } catch {
    return []
  }
}

function write(source: 'openeuler' | 'opengauss', ids: number[]) {
  const key = KEY_MAP[source]
  localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))))
  try {
    window.dispatchEvent(
      new CustomEvent('wrongbook:update', { detail: { source, count: ids.length } })
    )
  } catch {}
}

export function getWrongIds(source: 'openeuler' | 'opengauss'): number[] {
  return read(source)
}

export function addWrong(source: 'openeuler' | 'opengauss', id: number) {
  const ids = read(source)
  if (!ids.includes(id)) {
    ids.push(id)
    write(source, ids)
  }
}

export function removeWrong(source: 'openeuler' | 'opengauss', id: number) {
  const ids = read(source)
  const next = ids.filter((x) => x !== id)
  write(source, next)
}

export function clearWrong(source: 'openeuler' | 'opengauss') {
  write(source, [])
}

export function getWrongCount(source: 'openeuler' | 'opengauss') {
  return read(source).length
}