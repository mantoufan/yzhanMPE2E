export const exportData = map => {
  return {
    'Elements Found': map.size,
    'Elements Visited': map.size,
    'Popop Found': map.popup?.size,
    'Max Depth': map.maxDepth,
    'Report Detail': './report.yaml'
  }
}