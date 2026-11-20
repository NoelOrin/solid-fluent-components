import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridSelectionCell,
} from "../data-grid/DataGrid";
import { Table } from "../table/Table";

const meta = {
  title: "Data/DataGrid parts",
  component: DataGridHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "DataGrid 复合子组件：DataGridHeader / DataGridHeaderCell / DataGridBody / DataGridRow / DataGridCell / DataGridSelectionCell。",
      },
    },
  },
} satisfies Meta<typeof DataGridHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Parts: Story = {
  render: () => (
    <Table>
      <DataGridHeader>
        <DataGridHeaderCell>名称</DataGridHeaderCell>
        <DataGridHeaderCell>角色</DataGridHeaderCell>
        <DataGridHeaderCell>选择</DataGridHeaderCell>
      </DataGridHeader>
      <DataGridBody>
        <DataGridRow selected>
          <DataGridCell>张三</DataGridCell>
          <DataGridCell>工程师</DataGridCell>
          <DataGridSelectionCell checked />
        </DataGridRow>
        <DataGridRow>
          <DataGridCell>李四</DataGridCell>
          <DataGridCell>设计师</DataGridCell>
          <DataGridSelectionCell />
        </DataGridRow>
      </DataGridBody>
    </Table>
  ),
};
