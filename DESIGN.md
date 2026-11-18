# DESIGN.md

Design rules for the React client, built with MUI. Every rule is implemented once, in the MUI theme
(`client/src/theme/`), and components use the theme instead of hard-coding values. The values below are sensible
defaults and can be edited, except the 12 px red error text, which is specified.

## Typography

| Element | Rule | MUI mapping |
| --- | --- | --- |
| Page title | 24 px, weight 600 | `typography.h1` |
| Panel header | 18 px, weight 600 | `typography.h2` |
| Secondary header | 14 px, weight 600, uppercase | `typography.subtitle2` |
| Body text | 14 px, weight 400 | `typography.body1` |
| Table text | 13 px, weight 400 | `typography.body2` |
| Helper text (hover) | 12 px, weight 400 | `MuiTooltip` |
| Error text | 12 px, red | `typography.caption` with `palette.error.main` |

## Header and secondary header

| Element | Rule | MUI mapping |
| --- | --- | --- |
| Panel header | Panel title on the first line, bottom divider | `Typography variant="h2"` and `Divider` |
| Secondary header | Groups content inside a panel, muted color | `Typography variant="subtitle2"` with `text.secondary` |

## Buttons

| Element | Rule | MUI mapping |
| --- | --- | --- |
| Primary (Add, Save) | Filled, primary color, no uppercase | `Button variant="contained"`, `textTransform: 'none'` |
| Destructive (Delete) | Outlined, error color | `Button variant="outlined" color="error"` |
| Disabled | Reduced opacity, no hover effect | `Button disabled` |
| Hover helper text | Short tooltip, e.g. Delete: "Deletes selected polygons" | `Tooltip` |
| Size and spacing | Small, 8 px gap between buttons | `size="small"`, `Stack spacing={1}` |

## Panel

| Element | Rule | MUI mapping |
| --- | --- | --- |
| Surface | White, 1 px divider border, no shadow | `Paper variant="outlined"` |
| Padding | 16 px | `p: 2` |
| Gap between panels | 8 px | `Grid` or `Stack` with `spacing={1}` |
| Layout | Map on the left, Polygon, Objects and Map Data stacked on the right | `Grid` |
| Side column width | 400 px to start. A thin bar between the map and the panels is dragged to resize it (320 px up to 70% of the window), moved with the arrow keys, and reset by double-click | `ResizeHandle` (`role="separator"`) |

## Modal

Only if a modal is needed.

| Element | Rule | MUI mapping |
| --- | --- | --- |
| Width | 480 px, max 90% of the screen | `Dialog` with `maxWidth="xs"` and `fullWidth` |
| Title | Panel header style | `DialogTitle` |
| Actions | Cancel on the left, primary on the right | `DialogActions` |

## Table, row, column and cell

The Map Data table uses the MUI table components, styled only through the theme (`MuiTable*` overrides).

The Object cell of a row shows `name`, `type` and `object: { geometry }`. `object` starts open and `geometry` closed; a
click on the arrow opens it, down to the coordinates (`ObjectTree`, monospace, one line per field, no wrapping). A long
line scrolls inside its cell so Lat and Lon stay in view.

| Element | Rule | MUI mapping |
| --- | --- | --- |
| Table | Compact, header stays visible when scrolling | `Table size="small" stickyHeader` in a `TableContainer` |
| Header row | Secondary header style, bottom border | `TableHead`, `TableRow`, `TableCell` |
| Row | Hover highlight. Selected rows share the map selection color | `TableRow hover selected` |
| Selection column | Checkbox for multi-select, select-all in the header | `Checkbox` in a `TableCell padding="checkbox"` |
| Column: Object | Left aligned | `TableCell align="left"` |
| Column: Lat, Lon | Right aligned, 6 decimals | `TableCell align="right"` |
| Cell | 6 px vertical and 12 px horizontal padding | `MuiTableCell` `styleOverrides` |

## Map symbology

Colors live here so the map and the table stay consistent.

| Element | Rule | ArcGIS symbol |
| --- | --- | --- |
| Point (polygon vertex) | Blue fill, darker blue border, small radius | `SimpleMarkerSymbol` |
| Line | Very dark black | `SimpleLineSymbol` |
| Polygon | Closed shape of lines with the point symbol at every vertex | `SimpleLineSymbol` and `SimpleMarkerSymbol` |
| Selected | Highlighted, same color for the map and the table row | Highlight color from the theme |
| Selection box | Transparent bluish rectangle while click-and-dragging | Graphic with a translucent fill |
| Object symbol (Jeep, Truck) | Bundled image, 32 x 20 px, anchored at the object's location | `PictureMarkerSymbol` |

## Colors and spacing

| Token | Value | MUI mapping |
| --- | --- | --- |
| Primary | Blue | `palette.primary` |
| Error | Red | `palette.error` |
| Text | Dark grey, secondary text lighter | `palette.text.primary` and `palette.text.secondary` |
| Divider | Light grey | `palette.divider` |
| Spacing unit | 8 px | `theme.spacing` |
