// Simplified color system using direct hex colors
// Adapted for Estonian government structure

export const colorScheme = {
  official: {
    'prime-minister': { hex: '#7b0000', label: 'Prime Minister' },
    'cabinet-minister': { hex: '#c0392b', label: 'Cabinet Minister' },
    'head-of-state': { hex: '#4a235a', label: 'Head of State' },
    'independent-official': { hex: '#27ae60', label: 'Independent Official' },
    'civil-servant': { hex: '#3498db', label: 'Civil Servant' },
  },
  department: {
    ministerial: { hex: '#e74c3c', label: 'Ministry' },
    agency: { hex: '#8e44ad', label: 'Government Office / Chancellery' },
    portfolio: { hex: '#d4ac0d', label: 'Portfolio (no own ministry)' },
  },
  body: {
    'constitutional-body': { hex: '#1a5276', label: 'Constitutional Body' },
    'executive-agency': { hex: '#27ae60', label: 'Executive Agency' },
    regulator: { hex: '#c0392b', label: 'Regulator' },
    'public-law-body': { hex: '#2980b9', label: 'Public Law Body' },
    'security-agency': { hex: '#2e4057', label: 'Security Agency' },
    military: { hex: '#1b4f72', label: 'Military' },
    'state-enterprise': { hex: '#e67e22', label: 'State Enterprise' },
    'public-corporation': { hex: '#d35400', label: 'Public Corporation' },
    'training-institution': { hex: '#8e44ad', label: 'Training Institution' },
    'research-institute': { hex: '#2471a3', label: 'Research Institute' },
    inspectorate: { hex: '#16a085', label: 'Inspectorate' },
    other: { hex: '#95a5a6', label: 'Other Body' },
  },
  group: {
    cabinet: { hex: '#c0392b', label: 'Cabinet' },
    'other-group': { hex: '#8e44ad', label: 'Other Group' },
  },
}

export function getElementColor(category: string, subtype: string): string {
  const categoryColors = (colorScheme as any)[category]
  if (!categoryColors) return '#95a5a6'

  const typeColor = categoryColors[subtype]
  if (!typeColor) return '#95a5a6'

  return typeColor.hex
}

export function getLighterColor(category: string, subtype: string): string {
  const categoryColors = (colorScheme as any)[category]
  if (!categoryColors) return '#ecf0f1'

  const typeColor = categoryColors[subtype]
  if (!typeColor) return '#ecf0f1'

  const hex = typeColor.hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const lightR = Math.round(r + (255 - r) * 0.65)
  const lightG = Math.round(g + (255 - g) * 0.65)
  const lightB = Math.round(b + (255 - b) * 0.65)

  const toHex = (val: number) => val.toString(16).padStart(2, '0')
  return `#${toHex(lightR)}${toHex(lightG)}${toHex(lightB)}`
}

export function getColorInfo(category: string, subtype: string) {
  const categoryColors = (colorScheme as any)[category]
  if (!categoryColors) return { hex: '#95a5a6' }

  const typeColor = categoryColors[subtype]
  if (!typeColor) return { hex: '#95a5a6' }

  return {
    hex: typeColor.hex,
  }
}
