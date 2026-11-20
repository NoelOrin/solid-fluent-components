import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { TabList, Tab, TabPanels, TabPanel, Tabs } from "../tab-list/TabList";

const meta = {
  title: "Navigation/TabList",
  component: TabList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "选项卡：TabList / Tab / TabPanels / TabPanel。",
      },
    },
  },
} satisfies Meta<typeof TabList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div style={{ "min-width": "360px" }}>
      <Tabs defaultSelectedValue="tab1">
        <TabList>
          <Tab value="tab1">标签一</Tab>
          <Tab value="tab2">标签二</Tab>
          <Tab value="tab3">标签三</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="tab1">内容一</TabPanel>
          <TabPanel value="tab2">内容二</TabPanel>
          <TabPanel value="tab3">内容三</TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <TabList defaultSelectedValue="a">
      <Tab value="a">可用</Tab>
      <Tab value="b" disabled>
        禁用
      </Tab>
    </TabList>
  ),
};

export const Vertical: Story = {
  render: () => (
    <TabList vertical defaultSelectedValue="v1">
      <Tab value="v1">左一</Tab>
      <Tab value="v2">左二</Tab>
    </TabList>
  ),
};

export const ManualActivation: Story = {
  name: "手动激活 / 键盘导航",
  render: () => (
    <Tabs defaultSelectedValue="a">
      <TabList activationMode="manual">
        <Tab value="a">一</Tab>
        <Tab value="b">二</Tab>
        <Tab value="c">三</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="a">内容一</TabPanel>
        <TabPanel value="b">内容二</TabPanel>
        <TabPanel value="c">内容三</TabPanel>
      </TabPanels>
    </Tabs>
  ),
};
