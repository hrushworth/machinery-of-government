// Simplified color system using direct hex colors
// Much more reliable than OKLCH conversion

export const colorScheme = {
  official: {
    'prime-minister': { hex: '#7b0000', label: 'Prime Minister' },     // Darkest red
    'cabinet-minister': { hex: '#c0392b', label: 'Cabinet Minister' }, // Mid red
    'junior-minister': { hex: '#f1948a', label: 'Junior Minister' },   // Light red
    'civil-servant': { hex: '#3498db', label: 'Civil Servant' },       // Blue
    independent: { hex: '#27ae60', label: 'Independent Official' },    // Green
  },
  department: {
    ministerial: { hex: '#e74c3c', label: 'Ministerial Dept' },      // Red
    'non-ministerial': { hex: '#2980b9', label: 'Non-Ministerial' }, // Dark Blue
    agency: { hex: '#8e44ad', label: 'Executive Agency' },           // Purple
    'division-directorate': { hex: '#e74c3c', label: 'Division/Directorate' }, // Red
  },
  body: {
    'executive-ndpb': { hex: '#27ae60', label: 'Executive NDPB' },      // Green
    'advisory-ndpb': { hex: '#f1c40f', label: 'Advisory NDPB' },        // Yellow
    'public-corporation': { hex: '#e67e22', label: 'Public Corporation' }, // Orange
    'royal-charter-body': { hex: '#8e44ad', label: 'Royal Charter Body' }, // Purple
    tribunal: { hex: '#d35400', label: 'Tribunal' },                   // Dark Orange
    other: { hex: '#95a5a6', label: 'Other Body' },                    // Gray
  },
  group: {
    cabinet: { hex: '#c0392b', label: 'Cabinet' },                   // Cabinet minister red
    'other-group': { hex: '#8e44ad', label: 'Other Group' },          // Dark Purple
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
  
  // Return a lighter version by adjusting hex color toward white
  const hex = typeColor.hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  const lightR = Math.round(r + (255 - r) * 0.6)
  const lightG = Math.round(g + (255 - g) * 0.6)
  const lightB = Math.round(b + (255 - b) * 0.6)
  
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
