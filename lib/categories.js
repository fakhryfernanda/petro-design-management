export const CATEGORY_TREE = {
  Architecture: {
    Exterior: ['Fasad', 'Secondary Skin'],
    Interior: ['Ceiling', 'Backdrop', 'Partition', 'Furniture', 'Decorative'],
  },
  'Retail Support': {
    Advertising: ['Polesign', 'Shopsign', 'Lisplang'],
    Meubel: ['Meja Kasir', 'Rak Gondola', 'Rak Gudang'],
  },
}

export const CATEGORIES = Object.keys(CATEGORY_TREE)

export const getSubCategories1 = (cat) =>
  CATEGORY_TREE[cat] ? Object.keys(CATEGORY_TREE[cat]) : []

export const getSubCategories2 = (cat, sub1) =>
  CATEGORY_TREE[cat]?.[sub1] ?? []
