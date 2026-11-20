import { createSignal, For } from "solid-js";
import { render } from "solid-js/web";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Body1,
  Breadcrumb,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Checkbox,
  CounterBadge,
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Field,
  FluentProvider,
  Input,
  Label,
  Link,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Persona,
  ProgressBar,
  Radio,
  Select,
  Option,
  SimplePopover,
  SimpleTabs,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Tag,
  TagGroup,
  Text,
  Textarea,
  Title1,
  Title3,
  Toast,
  Toaster,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Tooltip,
  dispatchToast,
  tokens,
  webDarkTheme,
  webLightTheme,
} from "../src";

function App() {
  const [dark, setDark] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [checked, setChecked] = createSignal(true);
  const [enabled, setEnabled] = createSignal(true);
  const [progress, setProgress] = createSignal(0.42);

  return (
    <FluentProvider theme={dark() ? webDarkTheme : webLightTheme} applyToDocument>
      <Toaster position="top-end" />
      <div class="sf-demo-page">
        <div class="sf-demo-shell">
          <Stack tokens={{ childrenGap: 8 }}>
            <Title1>Solid Fluent Components</Title1>
            <Body1 style={{ color: tokens.colorNeutralForeground2 }}>
              使用 SolidJS + Vite 8 + TypeScript 7 重写的 Fluent UI 风格组件库。
            </Body1>
            <div class="sf-demo-row">
              <Switch
                checked={dark()}
                onChange={(event) => setDark(event.currentTarget.checked)}
                label={dark() ? "深色主题" : "浅色主题"}
              />
              <Button appearance="primary" onClick={() => setDialogOpen(true)}>
                打开对话框
              </Button>
              <Button onClick={() => setDrawerOpen(true)}>打开抽屉</Button>
              <Button
                appearance="outline"
                onClick={() =>
                  dispatchToast({
                    intent: "success",
                    title: "已保存",
                    body: "Solid Fluent 组件运行正常。",
                  })
                }
              >
                触发 Toast
              </Button>
            </div>
          </Stack>

          <Card>
            <CardHeader
              header={<Title3>按钮与输入</Title3>}
              description={<Text size={200}>Fluent 风格的基础交互控件</Text>}
              action={<Badge appearance="tint">Core</Badge>}
            />
            <div class="sf-demo-row">
              <Button appearance="primary">Primary</Button>
              <Button appearance="secondary">Secondary</Button>
              <Button appearance="outline">Outline</Button>
              <Button appearance="subtle">Subtle</Button>
              <Button appearance="transparent">Transparent</Button>
              <Button appearance="primary" disabled>
                Disabled
              </Button>
            </div>
            <Stack tokens={{ childrenGap: 12 }} style={{ "max-width": "420px" }}>
              <Field label="邮箱" required hint="用于接收通知">
                <Input type="email" placeholder="name@example.com" contentBefore="@" />
              </Field>
              <Field label="备注">
                <Textarea placeholder="写点什么..." />
              </Field>
              <Field label="角色">
                <Select>
                  <Option value="admin">管理员</Option>
                  <Option value="editor">编辑者</Option>
                  <Option value="viewer">访客</Option>
                </Select>
              </Field>
              <div class="sf-demo-row">
                <Checkbox
                  checked={checked()}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                  label="记住我"
                />
                <Radio name="plan" label="基础版" checked />
                <Radio name="plan" label="专业版" />
                <Switch
                  checked={enabled()}
                  onChange={(event) => setEnabled(event.currentTarget.checked)}
                  label="启用"
                />
              </div>
              <div>
                <Label>进度 {Math.round(progress() * 100)}%</Label>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={progress()}
                  onInput={(event) => setProgress(Number(event.currentTarget.value))}
                />
                <ProgressBar value={progress()} />
              </div>
            </Stack>
          </Card>

          <Card>
            <CardHeader header={<Title3>展示组件</Title3>} />
            <div class="sf-demo-row">
              <Avatar name="Ada Lovelace" size={48} />
              <Persona
                name="Grace Hopper"
                secondaryText="Rear Admiral / Compiler Pioneer"
                size="large"
              />
              <Badge appearance="filled" color="brand">
                New
              </Badge>
              <CounterBadge count={128} />
              <Spinner size="small" label="加载中" />
              <Tag appearance="brand" dismissible>
                Fluent
              </Tag>
              <TagGroup>
                <Tag>Solid</Tag>
                <Tag>Vite 8</Tag>
                <Tag>TS 7</Tag>
              </TagGroup>
            </div>
            <Divider>分隔线</Divider>
            <Skeleton width="60%" height={16} />
            <MessageBar intent="info">
              <MessageBarBody>
                <MessageBarTitle>提示</MessageBarTitle>
                主题令牌通过 CSS 变量注入，可兼容 Fluent 的 design tokens 思路。
              </MessageBarBody>
              <MessageBarActions>
                <Button appearance="transparent" size="small">
                  了解更多
                </Button>
              </MessageBarActions>
            </MessageBar>
          </Card>

          <Card>
            <CardHeader header={<Title3>导航与浮层</Title3>} />
            <Breadcrumb
              items={[
                { children: "首页", href: "#" },
                { children: "组件", href: "#" },
                { children: "Solid Fluent", current: true },
              ]}
            />
            <Toolbar>
              <ToolbarButton appearance="subtle">剪切</ToolbarButton>
              <ToolbarButton appearance="subtle">复制</ToolbarButton>
              <ToolbarDivider />
              <ToolbarButton appearance="primary">粘贴</ToolbarButton>
            </Toolbar>
            <div class="sf-demo-row">
              <Menu>
                <MenuTrigger>
                  <Button>菜单</Button>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem>新建</MenuItem>
                    <MenuItem>打开</MenuItem>
                    <MenuItem disabled>分享</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
              <Tooltip content="这是一个 Tooltip">
                <Button appearance="outline">悬停提示</Button>
              </Tooltip>
              <SimplePopover content={<Text>Popover 内容区域</Text>}>
                <Button appearance="subtle">Popover</Button>
              </SimplePopover>
              <Link href="https://github.com/microsoft/fluentui" target="_blank" rel="noreferrer">
                Fluent UI 参考
              </Link>
            </div>
            <SimpleTabs
              items={[
                { value: "one", label: "概况", content: <Body1>Tab 一：组件库概况</Body1> },
                { value: "two", label: "主题", content: <Body1>Tab 二：Light / Dark tokens</Body1> },
                { value: "three", label: "计划", content: <Body1>Tab 三：后续补齐 DataGrid / Tree 等</Body1> },
              ]}
            />
            <Accordion multiple defaultOpenItems={["a"]}>
              <AccordionItem value="a">
                <AccordionHeader>设计令牌</AccordionHeader>
                <AccordionPanel>颜色、字体、间距、阴影均映射为 `--sf-*` CSS 变量。</AccordionPanel>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionHeader>组件状态</AccordionHeader>
                <AccordionPanel>首批覆盖表单、反馈、导航、浮层等高频组件。</AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Card>

          <Card>
            <CardHeader header={<Title3>表格</Title3>} />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>组件</TableHeaderCell>
                  <TableHeaderCell>状态</TableHeaderCell>
                  <TableHeaderCell>说明</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <For
                  each={[
                    ["Button", "完成", "appearance / size / shape"],
                    ["Dialog", "完成", "Portal + overlay"],
                    ["DataGrid", "待做", "后续补齐"],
                  ]}
                >
                  {([name, status, note]) => (
                    <TableRow>
                      <TableCell>{name}</TableCell>
                      <TableCell>
                        <Badge color={status === "完成" ? "success" : "warning"}>{status}</Badge>
                      </TableCell>
                      <TableCell>{note}</TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
            <CardFooter>
              <Toast intent="info">
                <Text size={200}>本地预览：`npm run dev`</Text>
              </Toast>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
        <DialogContent
          title="确认操作"
          onClose={() => setDialogOpen(false)}
          actions={
            <>
              <Button appearance="secondary" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button appearance="primary" onClick={() => setDialogOpen(false)}>
                确认
              </Button>
            </>
          }
        >
          这是一个用 Solid 实现的 Fluent 风格 Dialog。
        </DialogContent>
      </Dialog>

      <Drawer open={drawerOpen()} onOpenChange={setDrawerOpen} position="end">
        <DrawerHeader onClose={() => setDrawerOpen(false)}>侧边抽屉</DrawerHeader>
        <DrawerBody>
          <Body1>可用于设置面板、详情页等场景。</Body1>
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="primary" onClick={() => setDrawerOpen(false)}>
            完成
          </Button>
        </DrawerFooter>
      </Drawer>
    </FluentProvider>
  );
}

render(() => <App />, document.getElementById("root")!);
