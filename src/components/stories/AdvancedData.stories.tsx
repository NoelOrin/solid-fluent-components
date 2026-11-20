import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { Tree } from "../tree/Tree";
import { Nav } from "../nav/Nav";
import { DataGrid } from "../data-grid/DataGrid";
import { Pagination } from "../utilities/pagination/Pagination";
import { Badge } from "../badge/Badge";
import { Body1 } from "../text/Text";

const meta = {
  title: "Data/Advanced",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
高级数据组件。

### Tree
items / openItems / selectedItems / selectionMode / onSelect

### Nav
items / selectedValue / onNavItemSelect / defaultOpenItems

### DataGrid
items / columns / sortable / selectionMode / selectedItems / virtualized

### Pagination
page / pageCount / onPageChange
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Employee = {
  id: number;
  name: string;
  role: string;
  status: "在线" | "离开" | "忙碌";
};

const employees: Employee[] = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", status: "在线" },
  { id: 2, name: "Grace Hopper", role: "Admiral", status: "忙碌" },
  { id: 3, name: "Alan Turing", role: "Scientist", status: "离开" },
  { id: 4, name: "Katherine Johnson", role: "Mathematician", status: "在线" },
];

export const TreeStory: Story = {
  name: "Tree",
  render: () => {
    const [selected, setSelected] = createSignal<Array<string | number>>(["docs"]);
    return (
      <div style={{ width: "280px" }}>
        <Tree
          defaultOpenItems={["src", "components"]}
          selectedItems={selected()}
          onSelect={setSelected}
          items={[
            {
              value: "src",
              content: "src",
              children: [
                {
                  value: "components",
                  content: "components",
                  children: [
                    { value: "button", content: "Button.tsx" },
                    { value: "tree", content: "Tree.tsx" },
                    { value: "datagrid", content: "DataGrid.tsx" },
                  ],
                },
                { value: "theme", content: "theme" },
              ],
            },
            {
              value: "docs",
              content: "docs",
              children: [{ value: "readme", content: "README.md" }],
            },
          ]}
        />
        <Body1 style={{ "margin-top": "12px" }}>
          选中：{selected().join(", ")}
        </Body1>
      </div>
    );
  },
};

export const NavStory: Story = {
  name: "Nav",
  render: () => {
    const [selected, setSelected] = createSignal<string | number>("overview");
    return (
      <Nav
        selectedValue={selected()}
        onNavItemSelect={setSelected}
        defaultOpenItems={["library"]}
        items={[
          { value: "overview", content: "概览", icon: <span>⌂</span> },
          {
            value: "library",
            content: "组件库",
            icon: <span>▦</span>,
            children: [
              { value: "inputs", content: "Inputs" },
              { value: "display", content: "Display" },
              { value: "data", content: "Data" },
            ],
          },
          { value: "settings", content: "设置", icon: <span>⚙</span> },
        ]}
      />
    );
  },
};

export const DataGridStory: Story = {
  name: "DataGrid",
  render: () => {
    const [selected, setSelected] = createSignal<Array<string | number>>([1]);
    const [sortColumn, setSortColumn] = createSignal<string | undefined>();
    const [sortDirection, setSortDirection] = createSignal<
      "asc" | "desc" | undefined
    >();
    const many = Array.from({ length: 200 }, (_, index) => ({
      id: index + 1,
      name: `Member ${index + 1}`,
      role: employees[index % employees.length]!.role,
      status: employees[index % employees.length]!.status,
    }));
    return (
      <div style={{ width: "680px", display: "flex", "flex-direction": "column", gap: "12px" }}>
        <DataGrid
          items={many}
          getRowId={(item) => item.id}
          sortable
          sortColumn={sortColumn()}
          sortDirection={sortDirection()}
          onSortChange={(change) => {
            setSortColumn(change.direction ? change.columnId : undefined);
            setSortDirection(change.direction ?? undefined);
          }}
          resizableColumns
          virtualized
          height={280}
          selectionMode="multiselect"
          selectedItems={selected()}
          onSelectionChange={setSelected}
          columns={[
            {
              columnId: "name",
              label: "姓名",
              compare: (a, b) => a.name.localeCompare(b.name),
              renderCell: (item) => item.name,
            },
            {
              columnId: "role",
              label: "角色",
              compare: (a, b) => a.role.localeCompare(b.role),
              renderCell: (item) => item.role,
            },
            {
              columnId: "status",
              label: "状态",
              compare: (a, b) => a.status.localeCompare(b.status),
              renderCell: (item) => (
                <Badge
                  color={
                    item.status === "在线"
                      ? "success"
                      : item.status === "忙碌"
                        ? "danger"
                        : "warning"
                  }
                >
                  {item.status}
                </Badge>
              ),
            },
          ]}
        />
        <Body1>
          已选：{selected().join(", ") || "无"}（支持虚拟滚动、键盘行导航、三态排序与拖拽列宽）
        </Body1>
      </div>
    );
  },
};

export const PaginationStory: Story = {
  name: "Pagination",
  render: () => {
    const [page, setPage] = createSignal(3);
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
        <Pagination page={page()} pageCount={12} onPageChange={setPage} />
        <Body1>当前页：{page()}</Body1>
      </div>
    );
  },
};
