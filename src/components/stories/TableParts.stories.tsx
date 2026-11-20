import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { Table, TableCellActions, TableResizeHandle, TableSelectionCell } from "../table/Table";
import { TableRow, TableCell } from "../table/Table";
import { Button } from "../button/Button";

const meta = {
  title: "Data/Table parts",
  component: TableCellActions,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Table 复合子组件：TableCellActions / TableResizeHandle / TableSelectionCell。",
      },
    },
  },
} satisfies Meta<typeof TableCellActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = {
  render: () => (
    <Table>
      <tbody>
        <TableRow>
          <TableCell>行数据</TableCell>
          <TableCell>
            <TableCellActions visible={false}>
              <Button appearance="subtle" size="small">编辑</Button>
              <Button appearance="subtle" size="small">删除</Button>
            </TableCellActions>
          </TableCell>
        </TableRow>
      </tbody>
    </Table>
  ),
};

export const SelectionAndResize: Story = {
  render: () => {
    const [width, setWidth] = createSignal(160);
    return (
      <Table>
        <tbody>
          <TableRow>
            <TableSelectionCell checked />
            <TableCell>
              <div style={{ width: `${width()}px` }}>可调整列宽</div>
            </TableCell>
            <TableCell>
              <TableResizeHandle onResize={setWidth} />
            </TableCell>
          </TableRow>
        </tbody>
      </Table>
    );
  },
};
