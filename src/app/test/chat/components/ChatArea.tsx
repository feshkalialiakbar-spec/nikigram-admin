import svgPaths from "../imports/svg-0dqf7vdgz1";

function Frame8({ subject }: { subject?: string }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['Vazirmatn:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#2d59c8] text-[16px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          {subject || "موضوع تیکت به پشتیبانی"}
        </p>
      </div>
    </div>
  );
}

function VuesaxBulkProfile() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/profile">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="profile">
          <path d={svgPaths.p13d05a80} fill="var(--fill-0, #0E315D)" id="Vector" opacity="0.4" />
          <path d={svgPaths.pbb46500} fill="var(--fill-0, #0E315D)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #0E315D)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkProfile1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/profile">
      <VuesaxBulkProfile />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['IRANSansWebFaNum:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#243464] text-[12px] text-nowrap text-right whitespace-pre" dir="auto">
        شما
      </p>
      <VuesaxBulkProfile1 />
    </div>
  );
}

function VuesaxBulkEdit() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/edit">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="edit">
          <path d={svgPaths.p3a6dbc80} fill="var(--fill-0, #0E315D)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p2ef1a800} fill="var(--fill-0, #0E315D)" id="Vector_2" />
          <path d={svgPaths.p2dc85900} fill="var(--fill-0, #0E315D)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkEdit1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="vuesax/bulk/edit">
      <VuesaxBulkEdit />
    </div>
  );
}

function ConversationMessagesDateTime({ time }: { time: string }) {
  return (
    <div className="content-stretch flex gap-[16px] h-full items-center justify-end relative shrink-0" data-name="conversation/messages/date_time">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#5e758e] text-[10px] text-nowrap whitespace-pre">{time}</p>
    </div>
  );
}

function Frame7({ time }: { time: string }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <VuesaxBulkEdit1 />
      <div className="flex flex-row items-center self-stretch">
        <ConversationMessagesDateTime time={time} />
      </div>
    </div>
  );
}

function Frame6({ text, time }: { text: string; time: string }) {
  return (
    <div className="bg-[#b7cfe8] relative rounded-bl-[12px] rounded-br-[12px] rounded-tl-[12px] shrink-0 w-full">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start justify-center px-[16px] py-[8px] relative w-full">
          <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131d28] text-[12px] text-right w-full" dir="auto">
            {text}
          </p>
          <Frame7 time={time} />
        </div>
      </div>
    </div>
  );
}

function UserMessage({ text, time }: { text: string; time: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-[446px]">
      <Frame1 />
      <Frame6 text={text} time={time} />
    </div>
  );
}

function VuesaxBulkProfile2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/profile">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="profile">
          <path d={svgPaths.p13d05a80} fill="var(--fill-0, #0E315D)" id="Vector" opacity="0.4" />
          <path d={svgPaths.pbb46500} fill="var(--fill-0, #0E315D)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #0E315D)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkProfile3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/profile">
      <VuesaxBulkProfile2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <VuesaxBulkProfile3 />
      <p className="font-['IRANSansWebFaNum:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#50545f] text-[12px] text-nowrap text-right whitespace-pre" dir="auto">
        نیکی میزانی
      </p>
    </div>
  );
}

function ConversationMessagesDateTime1({ time }: { time: string }) {
  return (
    <div className="content-stretch flex gap-[16px] h-full items-center justify-end relative shrink-0" data-name="conversation/messages/date_time">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#5e758e] text-[10px] text-nowrap whitespace-pre">{time}</p>
    </div>
  );
}

function Frame10({ time }: { time: string }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="flex flex-row items-center self-stretch">
        <ConversationMessagesDateTime1 time={time} />
      </div>
    </div>
  );
}

function Frame11({ text, time }: { text: string; time: string }) {
  return (
    <div className="bg-[#ebf1f8] relative rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px] shrink-0 w-full">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start justify-center px-[16px] py-[8px] relative w-full">
          <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131d28] text-[12px] text-right w-full" dir="auto">
            {text}
          </p>
          <Frame10 time={time} />
        </div>
      </div>
    </div>
  );
}

function AgentMessage({ text, time }: { text: string; time: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-[363px]">
      <Frame2 />
      <Frame11 text={text} time={time} />
    </div>
  );
}

function Frame14({ text, time }: { text: string; time: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <AgentMessage text={text} time={time} />
    </div>
  );
}

function Frame9({ userMessage, agentMessage }: { 
  userMessage: { text: string; time: string }; 
  agentMessage: { text: string; time: string } 
}) {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-end relative shrink-0 w-full">
      <UserMessage text={userMessage.text} time={userMessage.time} />
      <Frame14 text={agentMessage.text} time={agentMessage.time} />
    </div>
  );
}

function Frame12({ userMessage, agentMessage }: { 
  userMessage: { text: string; time: string }; 
  agentMessage: { text: string; time: string } 
}) {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[40px] grow items-start min-h-px min-w-px relative shrink-0 w-full">
      <Frame9 userMessage={userMessage} agentMessage={agentMessage} />
    </div>
  );
}

function VuesaxBulkCamera() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/camera">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="camera">
          <path d={svgPaths.p3cb5f780} fill="var(--fill-0, #0E315D)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p31e9bc80} fill="var(--fill-0, #0E315D)" id="Vector_2" />
          <path d={svgPaths.p39bc3300} fill="var(--fill-0, #131D28)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkCamera1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/camera">
      <VuesaxBulkCamera />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[25.97%_26.01%_27.58%_25.04%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path d={svgPaths.p332e9600} fill="var(--fill-0, #131D28)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[25.97%_26.01%_27.58%_25.04%]" data-name="Group">
      <Group />
    </div>
  );
}

function AttachSquare() {
  return (
    <div className="absolute contents inset-0" data-name="attach-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #0E315D)" id="Vector" opacity="0" />
      </svg>
      <div className="absolute inset-[8.33%_8.33%_8.38%_8.38%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={svgPaths.p10627200} fill="var(--fill-0, #0E315D)" id="Vector" opacity="0.4" />
        </svg>
      </div>
      <Group1 />
    </div>
  );
}

function VuesaxBulkAttachSquare() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/attach-square">
      <AttachSquare />
    </div>
  );
}

function VuesaxBulkAttachSquare1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/attach-square">
      <VuesaxBulkAttachSquare />
    </div>
  );
}

function TextCursor() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="Text + Cursor">
      <div className="flex flex-col font-['Morabba:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9eb8d4] text-[14px] text-nowrap">
        <p className="leading-[24px] whitespace-pre" dir="auto">
          پیام
        </p>
      </div>
    </div>
  );
}

function LeftContent() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Left Content">
      <TextCursor />
    </div>
  );
}

function InputFrame() {
  return (
    <div className="bg-white h-[40px] relative rounded-[20px] shrink-0 w-full" data-name="Input Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[40px] items-center px-[16px] py-[8px] relative w-full">
          <VuesaxBulkCamera1 />
          <VuesaxBulkAttachSquare1 />
          <LeftContent />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#b7cfe8] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Component() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow h-[40px] items-start min-h-px min-w-px relative shrink-0" data-name="Component 2">
      <InputFrame />
    </div>
  );
}

function VuesaxBulkMicrophone() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/microphone-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="microphone-2">
          <path d={svgPaths.p1899c780} fill="var(--fill-0, white)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p7f348f0} fill="var(--fill-0, white)" id="Vector_2" />
          <g id="Vector_3" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkMicrophone1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/microphone-2">
      <VuesaxBulkMicrophone />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#b7cfe8] relative rounded-[24px] shrink-0 w-[40px]" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-center justify-center px-[24px] py-[8px] relative w-[40px]">
          <VuesaxBulkMicrophone1 />
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-col h-[44px] items-start relative shrink-0 w-[40px]" data-name="Component 4">
      <div className="absolute bg-[#9eb8d4] left-0 rounded-[24px] size-[40px] top-[3px]" />
      <Button />
    </div>
  );
}

function Frame13() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0 w-full">
      <Component />
      <Component1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0 w-full mt-auto">
      <Frame13 />
    </div>
  );
}

export default function ChatArea({ 
  subject = "موضوع تیکت به پشتیبانی",
  userMessage = { text: "این متن شامل پیام توضیحات می باشد.", time: "امروز، ۱۳:۳۰" },
  agentMessage = { text: "این متن شامل پیام توضیحات می باشد.", time: "۲۴ تیر ۱۴۰۳، ۱۳:۴۵" }
}: {
  subject?: string;
  userMessage?: { text: string; time: string };
  agentMessage?: { text: string; time: string };
}) {
  return (
    <div className="bg-white relative rounded-[24px] flex-1 flex flex-col min-h-[600px]">
      <div className="flex flex-col items-end flex-1 overflow-hidden">
        <div className="box-border content-stretch flex flex-col gap-[40px] items-end px-[24px] pt-[40px] pb-[24px] relative w-full flex-1 overflow-y-auto">
          <div className="w-full">
            <Frame8 subject={subject} />
          </div>
          <div className="flex-1 w-full min-h-0">
            <Frame12 userMessage={userMessage} agentMessage={agentMessage} />
          </div>
          <div className="w-full mt-auto pt-4">
            <Frame4 />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#dee3e7] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}
