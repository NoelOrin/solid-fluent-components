import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { PresenceGroup, PresenceComponent } from "../motion/presence-group/PresenceGroup";
import { AnnounceProvider, AriaLiveAnnouncer, useAnnouncer } from "../utilities/aria-live/Announcer";
import { Button } from "../button/Button";

const meta = {
  title: "Display/Presence",
  component: PresenceGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
在线状态组件族。

### API
- \`PresenceGroup\`：状态分组容器。
- \`PresenceComponent\`：单状态点，\`status\` 见 PresenceBadge 状态枚举，\`outOfOffice\` 外出标记。
- \`AnnounceProvider\` / \`AriaLiveAnnouncer\` / \`useAnnouncer()\`：屏幕阅读器实时播报（ARIA live region）。
`,
      },
    },
  },
} satisfies Meta<typeof PresenceGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Group: Story = {
  render: () => (
    <PresenceGroup>
      <PresenceComponent status="available" />
      <PresenceComponent status="busy" />
      <PresenceComponent status="away" />
      <PresenceComponent status="do-not-disturb" />
      <PresenceComponent status="offline" outOfOffice />
    </PresenceGroup>
  ),
};

export const Announcer: Story = {
  name: "AriaLiveAnnouncer",
  render: () => {
    const [msg, setMsg] = createSignal("");
    const Demo = () => {
      const announce = useAnnouncer().announce;
      return (
        <Button
          onClick={() => {
            setMsg("已保存");
            announce("已保存");
          }}
        >
          触发播报
        </Button>
      );
    };
    return (
      <AnnounceProvider>
        <Demo />
        <p>当前播报：{msg()}</p>
        <AriaLiveAnnouncer />
      </AnnounceProvider>
    );
  },
};
