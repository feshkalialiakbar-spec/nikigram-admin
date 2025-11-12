import svgPaths from "./svg-x98sifuilj";
import imgImage from "figma:asset/7df74d128b99d8dcb62d492ba5809e7f44f9dd3e.png";

function Frame40() {
  return (
    <div className="content-stretch flex gap-[2px] items-center leading-[0] not-italic relative shrink-0 text-nowrap text-right w-full">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center relative shrink-0 text-[#1f2b37] text-[14px]">
        <p className="leading-[normal] text-nowrap whitespace-pre" dir="auto">
          صندوق مهربانی
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center relative shrink-0 text-[#435a73] text-[12px]">
        <p className="leading-[normal] text-nowrap whitespace-pre" dir="auto">
          صندوق مربوطه
        </p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 text-[#435a73] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:DemiBold',sans-serif] leading-[24px] relative shrink-0 text-[16px]" dir="auto">
        2,005,679,680
      </p>
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[normal] relative shrink-0 text-[12px]" dir="auto">
        ریال
      </p>
    </div>
  );
}

function DataType() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center overflow-clip relative shrink-0" data-name="Data/Type 1">
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#5d6e82] text-[12px] text-nowrap text-right">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          بروزرسانی دوشنبه، ۲۰ مرداد
        </p>
      </div>
    </div>
  );
}

function Left() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end overflow-clip relative shrink-0" data-name="Left">
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#131d28] text-[16px] text-nowrap text-right whitespace-pre" dir="auto">
        صندوق معیشت
      </p>
      <DataType />
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#1f7634] box-border content-stretch flex flex-col gap-[8px] items-center justify-center overflow-clip pb-[6px] pt-0 px-0 relative rounded-[8px] shrink-0 size-[69px]">
      <div className="flex flex-col font-['Morabba:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-right text-white">
        <p className="leading-none whitespace-pre" dir="auto">
          معیشت
        </p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0">
      <Left />
      <Frame10 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame12 />
      <Frame11 />
    </div>
  );
}

function NumberStatsChartsTotalOrder() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Number Stats & Charts/Total order">
      <div aria-hidden="true" className="absolute border border-[#d1e1f2] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-center justify-center px-[24px] py-[16px] relative w-full">
          <Frame39 />
        </div>
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[2px] items-center leading-[0] not-italic relative shrink-0 text-nowrap text-right w-full">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center relative shrink-0 text-[#1f2b37] text-[14px]">
        <p className="leading-[normal] text-nowrap whitespace-pre" dir="auto">
          4 فاز
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center relative shrink-0 text-[#435a73] text-[12px]">
        <p className="leading-[normal] text-nowrap whitespace-pre" dir="auto">
          تعداد فازها
        </p>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-end relative shrink-0 w-full">
      <Frame40 />
      <NumberStatsChartsTotalOrder />
      <Frame41 />
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-right w-full">
        <p className="leading-[normal]" dir="auto">{`لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه `}</p>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IRANSansXFaNum:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#131d28] text-[16px] text-center w-full">
        <p className="leading-[24px]" dir="auto">
          تمپلیت 1
        </p>
      </div>
      <Frame42 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-start p-[24px] relative rounded-[16px] shrink-0 w-[558px]">
      <div aria-hidden="true" className="absolute border border-[#d1e1f2] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame43 />
    </div>
  );
}

function VuesaxBulkArrowUp() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/arrow-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow-up">
          <path d={svgPaths.p9f39700} fill="var(--fill-0, #007BFF)" id="Vector" />
          <path d={svgPaths.p369d6c00} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <g id="Vector_3" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkArrowUp1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/arrow-up">
      <VuesaxBulkArrowUp />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-end relative shrink-0">
      <p className="font-['IRANSansXFaNum:DemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-nowrap text-right whitespace-pre" dir="auto">
        اجرای ساخت
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#435a73] text-[14px] text-nowrap text-right whitespace-pre" dir="auto">
        فاز 1:
      </p>
      <div className="relative shrink-0 size-[8px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, #007BFF)" id="Ellipse 8" r="4" />
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <VuesaxBulkArrowUp1 />
      <div className="flex flex-row items-center self-stretch">
        <Frame7 />
      </div>
    </div>
  );
}

function VuesaxBulkEdit() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/edit-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="edit-2">
          <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkEdit1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/edit-2">
      <VuesaxBulkEdit />
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 4">
      <VuesaxBulkEdit1 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[24px] whitespace-pre" dir="auto">
          نسترن علی‌پور
        </p>
      </div>
      <div className="relative rounded-[200px] shrink-0 size-[20px]" data-name="Image">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
          <div className="absolute bg-[#d4afbd] inset-0 rounded-[200px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgImage} />
        </div>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Container />
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1f2b37] text-[16px] text-nowrap text-right whitespace-pre" dir="auto">
        انتصاب به کاربر:
      </p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component />
      <Frame61 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          هم‌نیاز : تسک 2
        </p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#edfaff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <Container1 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        خاک‌برداری و فونداسیون
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 1:
      </p>
    </div>
  );
}

function VuesaxBulkTickSquare() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/tick-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tick-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #28A745)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkTickSquare1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/tick-square">
      <VuesaxBulkTickSquare />
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 5">
      <VuesaxBulkTickSquare1 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Badge />
      <Frame19 />
      <Component1 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame28 />
      <Frame45 />
    </div>
  );
}

function VuesaxBulkEdit2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/edit-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="edit-2">
          <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkEdit3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/edit-2">
      <VuesaxBulkEdit2 />
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 4">
      <VuesaxBulkEdit3 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-nowrap">
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#334558] text-[14px] text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          تاریخ و زمان انتشار: 11:00 - 1404/02/29
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#334558] text-[14px] text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          _
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          ناظر ساخت ساختمان
        </p>
      </div>
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37] text-[16px] text-right whitespace-pre" dir="auto">
        مناقصه:
      </p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component3 />
      <Frame63 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          هم‌نیاز : تسک 1
        </p>
      </div>
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#edfaff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <Container2 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        نازک‌کاری (گچ، رنگ، پنجره، کف‌پوش)
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 2:
      </p>
    </div>
  );
}

function VuesaxBulkTickSquare2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/tick-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tick-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #28A745)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkTickSquare3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/tick-square">
      <VuesaxBulkTickSquare2 />
    </div>
  );
}

function Component4() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 5">
      <VuesaxBulkTickSquare3 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Badge1 />
      <Frame20 />
      <Component4 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame29 />
      <Frame47 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#b7cfe8] border-[0px_1px_0px_0px] border-dashed inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start pl-0 pr-[16px] py-[8px] relative w-full">
          <Frame24 />
          <Frame18 />
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#ebf1f8] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-col items-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-end p-[16px] relative w-full">
          <Frame1 />
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function VuesaxBulkArrowUp2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/arrow-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow-up">
          <path d={svgPaths.p9f39700} fill="var(--fill-0, #007BFF)" id="Vector" />
          <path d={svgPaths.p369d6c00} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <g id="Vector_3" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkArrowUp3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/arrow-up">
      <VuesaxBulkArrowUp2 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-end relative shrink-0">
      <p className="font-['IRANSansXFaNum:DemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-nowrap text-right whitespace-pre" dir="auto">
        گودبرداری
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#435a73] text-[14px] text-nowrap text-right whitespace-pre" dir="auto">
        فاز 2:
      </p>
      <div className="relative shrink-0 size-[8px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, #007BFF)" id="Ellipse 8" r="4" />
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <VuesaxBulkArrowUp3 />
      <div className="flex flex-row items-center self-stretch">
        <Frame8 />
      </div>
    </div>
  );
}

function VuesaxBulkEdit4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/edit-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="edit-2">
          <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkEdit5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/edit-2">
      <VuesaxBulkEdit4 />
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 4">
      <VuesaxBulkEdit5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[24px] whitespace-pre" dir="auto">
          نسترن علی‌پور
        </p>
      </div>
      <div className="relative rounded-[200px] shrink-0 size-[20px]" data-name="Image">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
          <div className="absolute bg-[#d4afbd] inset-0 rounded-[200px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgImage} />
        </div>
      </div>
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Container3 />
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1f2b37] text-[16px] text-nowrap text-right whitespace-pre" dir="auto">
        انتصاب به کاربر:
      </p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component5 />
      <Frame64 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        خاک‌برداری و فونداسیون
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 1:
      </p>
    </div>
  );
}

function VuesaxBulkTickSquare4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/tick-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tick-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #28A745)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkTickSquare5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/tick-square">
      <VuesaxBulkTickSquare4 />
    </div>
  );
}

function Component6() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 5">
      <VuesaxBulkTickSquare5 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame25 />
      <Component6 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame46 />
      <Frame48 />
    </div>
  );
}

function Text() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[8px] py-0 relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          انتصاب به مناقصه
        </p>
      </div>
    </div>
  );
}

function Component7() {
  return (
    <div className="h-[32px] relative rounded-[24px] shrink-0 w-[151px]" data-name="Component 4">
      <div className="box-border content-stretch flex h-[32px] items-center justify-center overflow-clip px-[24px] py-[4px] relative rounded-[inherit] w-[151px]">
        <Text />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#007bff] border-solid inset-[-1px] pointer-events-none rounded-[25px]" />
    </div>
  );
}

function Text1() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[8px] py-0 relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          انتصاب به کاربر
        </p>
      </div>
    </div>
  );
}

function Component8() {
  return (
    <div className="h-[32px] relative rounded-[24px] shrink-0 w-[151px]" data-name="Component 5">
      <div className="box-border content-stretch flex h-[32px] items-center justify-center overflow-clip px-[24px] py-[4px] relative rounded-[inherit] w-[151px]">
        <Text1 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#007bff] border-solid inset-[-1px] pointer-events-none rounded-[25px]" />
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component7 />
      <Component8 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          هم‌نیاز : تسک 3
        </p>
      </div>
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-[#edfaff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <Container4 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#e29400] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          پیش‌نیاز : تسک 1
        </p>
      </div>
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-[#ffffea] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0 w-[115px]" data-name="Badge">
      <Container5 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        اسکلت‌بندی (بتنی یا فلزی)
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 2:
      </p>
    </div>
  );
}

function VuesaxBulkCloseSquare() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/close-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="close-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #E70218)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p2bbbf000} fill="var(--fill-0, #E70218)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #E70218)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkCloseSquare1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/close-square">
      <VuesaxBulkCloseSquare />
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 6">
      <VuesaxBulkCloseSquare1 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Badge2 />
      <Badge3 />
      <Frame23 />
      <Component2 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame62 />
      <Frame49 />
    </div>
  );
}

function VuesaxBulkEdit6() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/edit-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="edit-2">
          <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkEdit7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/edit-2">
      <VuesaxBulkEdit6 />
    </div>
  );
}

function Component9() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 4">
      <VuesaxBulkEdit7 />
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-nowrap">
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#334558] text-[14px] text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          تاریخ و زمان انتشار: 11:00 - 1404/02/29
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#334558] text-[14px] text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          _
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          ناظر ساخت ساختمان
        </p>
      </div>
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37] text-[16px] text-right whitespace-pre" dir="auto">
        مناقصه:
      </p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component9 />
      <Frame65 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          هم‌نیاز : تسک 2
        </p>
      </div>
    </div>
  );
}

function Badge4() {
  return (
    <div className="bg-[#edfaff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <Container6 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#e29400] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          پیش‌نیاز : تسک 1
        </p>
      </div>
    </div>
  );
}

function Badge5() {
  return (
    <div className="bg-[#ffffea] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0 w-[115px]" data-name="Badge">
      <Container7 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        سفت‌کاری و دیوارچینی
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 3:
      </p>
    </div>
  );
}

function VuesaxBulkTickSquare6() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/tick-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tick-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #28A745)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkTickSquare7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/tick-square">
      <VuesaxBulkTickSquare6 />
    </div>
  );
}

function Component10() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 5">
      <VuesaxBulkTickSquare7 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Badge4 />
      <Badge5 />
      <Frame22 />
      <Component10 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame50 />
      <Frame51 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#b7cfe8] border-[0px_1px_0px_0px] border-dashed inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start pl-0 pr-[16px] py-[8px] relative w-full">
          <Frame14 />
          <Frame15 />
          <Frame26 />
        </div>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#ebf1f8] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-col items-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-end p-[16px] relative w-full">
          <Frame2 />
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function VuesaxBulkArrowUp4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/arrow-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow-up">
          <path d={svgPaths.p9f39700} fill="var(--fill-0, #007BFF)" id="Vector" />
          <path d={svgPaths.p369d6c00} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <g id="Vector_3" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkArrowUp5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/arrow-up">
      <VuesaxBulkArrowUp4 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-end relative shrink-0">
      <p className="font-['IRANSansXFaNum:DemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-nowrap text-right whitespace-pre" dir="auto">
        ساخت اسکلت
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#435a73] text-[14px] text-nowrap text-right whitespace-pre" dir="auto">
        فاز 3:
      </p>
      <div className="relative shrink-0 size-[8px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, #007BFF)" id="Ellipse 8" r="4" />
        </svg>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <VuesaxBulkArrowUp5 />
      <div className="flex flex-row items-center self-stretch">
        <Frame9 />
      </div>
    </div>
  );
}

function VuesaxBulkEdit8() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/edit-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="edit-2">
          <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkEdit9() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/edit-2">
      <VuesaxBulkEdit8 />
    </div>
  );
}

function Component11() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 4">
      <VuesaxBulkEdit9 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-nowrap">
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#334558] text-[14px] text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          تاریخ و زمان انتشار: 11:00 - 1404/02/29
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#334558] text-[14px] text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          _
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          ناظر ساخت ساختمان
        </p>
      </div>
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37] text-[16px] text-right whitespace-pre" dir="auto">
        مناقصه:
      </p>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component11 />
      <Frame66 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        خاک‌برداری و فونداسیون
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 1:
      </p>
    </div>
  );
}

function VuesaxBulkTickSquare8() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/tick-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tick-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #28A745)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkTickSquare9() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/tick-square">
      <VuesaxBulkTickSquare8 />
    </div>
  );
}

function Component12() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 5">
      <VuesaxBulkTickSquare9 />
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame27 />
      <Component12 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame52 />
      <Frame53 />
    </div>
  );
}

function Text2() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[8px] py-0 relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          انتصاب به مناقصه
        </p>
      </div>
    </div>
  );
}

function Component13() {
  return (
    <div className="h-[32px] relative rounded-[24px] shrink-0 w-[151px]" data-name="Component 4">
      <div className="box-border content-stretch flex h-[32px] items-center justify-center overflow-clip px-[24px] py-[4px] relative rounded-[inherit] w-[151px]">
        <Text2 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#007bff] border-solid inset-[-1px] pointer-events-none rounded-[25px]" />
    </div>
  );
}

function Text3() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[8px] py-0 relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          انتصاب به کاربر
        </p>
      </div>
    </div>
  );
}

function Component14() {
  return (
    <div className="h-[32px] relative rounded-[24px] shrink-0 w-[151px]" data-name="Component 5">
      <div className="box-border content-stretch flex h-[32px] items-center justify-center overflow-clip px-[24px] py-[4px] relative rounded-[inherit] w-[151px]">
        <Text3 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#007bff] border-solid inset-[-1px] pointer-events-none rounded-[25px]" />
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component13 />
      <Component14 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          هم‌نیاز : تسک 3
        </p>
      </div>
    </div>
  );
}

function Badge6() {
  return (
    <div className="bg-[#edfaff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <Container8 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#e29400] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          پیش‌نیاز : تسک 1
        </p>
      </div>
    </div>
  );
}

function Badge7() {
  return (
    <div className="bg-[#ffffea] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0 w-[115px]" data-name="Badge">
      <Container9 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        اسکلت‌بندی (بتنی یا فلزی)
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 2:
      </p>
    </div>
  );
}

function VuesaxBulkCloseSquare2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/close-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="close-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #E70218)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p2bbbf000} fill="var(--fill-0, #E70218)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #E70218)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkCloseSquare3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/close-square">
      <VuesaxBulkCloseSquare2 />
    </div>
  );
}

function Component15() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 5">
      <VuesaxBulkCloseSquare3 />
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Badge6 />
      <Badge7 />
      <Frame31 />
      <Component15 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame67 />
      <Frame54 />
    </div>
  );
}

function VuesaxBulkEdit10() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/edit-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="edit-2">
          <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkEdit11() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/edit-2">
      <VuesaxBulkEdit10 />
    </div>
  );
}

function Component16() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 4">
      <VuesaxBulkEdit11 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[24px] whitespace-pre" dir="auto">
          نسترن علی‌پور
        </p>
      </div>
      <div className="relative rounded-[200px] shrink-0 size-[20px]" data-name="Image">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
          <div className="absolute bg-[#d4afbd] inset-0 rounded-[200px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgImage} />
        </div>
      </div>
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Container10 />
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1f2b37] text-[16px] text-nowrap text-right whitespace-pre" dir="auto">
        انتصاب به کاربر:
      </p>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component16 />
      <Frame68 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          هم‌نیاز : تسک 3
        </p>
      </div>
    </div>
  );
}

function Badge8() {
  return (
    <div className="bg-[#edfaff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <Container11 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#e29400] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          پیش‌نیاز : تسک 1
        </p>
      </div>
    </div>
  );
}

function Badge9() {
  return (
    <div className="bg-[#ffffea] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0 w-[115px]" data-name="Badge">
      <Container12 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        سفت‌کاری و دیوارچینی
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 3:
      </p>
    </div>
  );
}

function VuesaxBulkTickSquare10() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/tick-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tick-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #28A745)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkTickSquare11() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/tick-square">
      <VuesaxBulkTickSquare10 />
    </div>
  );
}

function Component17() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 5">
      <VuesaxBulkTickSquare11 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Badge8 />
      <Badge9 />
      <Frame33 />
      <Component17 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame55 />
      <Frame56 />
    </div>
  );
}

function VuesaxBulkEdit12() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/edit-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="edit-2">
          <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkEdit13() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/edit-2">
      <VuesaxBulkEdit12 />
    </div>
  );
}

function Component18() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 4">
      <VuesaxBulkEdit13 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[24px] whitespace-pre" dir="auto">
          نسترن علی‌پور
        </p>
      </div>
      <div className="relative rounded-[200px] shrink-0 size-[20px]" data-name="Image">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
          <div className="absolute bg-[#d4afbd] inset-0 rounded-[200px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgImage} />
        </div>
      </div>
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Container13 />
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1f2b37] text-[16px] text-nowrap text-right whitespace-pre" dir="auto">
        انتصاب به کاربر:
      </p>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component18 />
      <Frame69 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          هم‌نیاز : تسک 3
        </p>
      </div>
    </div>
  );
}

function Badge10() {
  return (
    <div className="bg-[#edfaff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <Container14 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        تاسیسات (برق، آب، گاز)
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 4:
      </p>
    </div>
  );
}

function VuesaxBulkTickSquare12() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/tick-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tick-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #28A745)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkTickSquare13() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/tick-square">
      <VuesaxBulkTickSquare12 />
    </div>
  );
}

function Component19() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 5">
      <VuesaxBulkTickSquare13 />
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Badge10 />
      <Frame21 />
      <Component19 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame57 />
      <Frame58 />
    </div>
  );
}

function VuesaxBulkEdit14() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/edit-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="edit-2">
          <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkEdit15() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/edit-2">
      <VuesaxBulkEdit14 />
    </div>
  );
}

function Component20() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 4">
      <VuesaxBulkEdit15 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-nowrap">
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#334558] text-[14px] text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          تاریخ و زمان انتشار: 11:00 - 1404/02/29
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#334558] text-[14px] text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          _
        </p>
      </div>
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-center">
        <p className="leading-[24px] text-nowrap whitespace-pre" dir="auto">
          ناظر ساخت ساختمان
        </p>
      </div>
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37] text-[16px] text-right whitespace-pre" dir="auto">
        مناقصه:
      </p>
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Component20 />
      <Frame70 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007bff] text-[14px] text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          هم‌نیاز : تسک 3
        </p>
      </div>
    </div>
  );
}

function Badge11() {
  return (
    <div className="bg-[#edfaff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <Container15 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[8px] items-center not-italic relative shrink-0 text-[14px] text-nowrap text-right whitespace-pre">
      <p className="font-['IRANSansXFaNum:Regular',sans-serif] leading-[24px] relative shrink-0 text-[#1f2b37]" dir="auto">
        نازک‌کاری (گچ، رنگ، پنجره، کف‌پوش)
      </p>
      <p className="font-['IRANSansXFaNum:Medium',sans-serif] leading-[normal] relative shrink-0 text-[#5e758e]" dir="auto">
        تسک 5:
      </p>
    </div>
  );
}

function VuesaxBulkTickSquare14() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/tick-square">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tick-square">
          <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
          <path d="M24 0H0V24H24V0Z" fill="var(--fill-0, #28A745)" id="Vector_3" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBulkTickSquare15() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bulk/tick-square">
      <VuesaxBulkTickSquare14 />
    </div>
  );
}

function Component21() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Component 5">
      <VuesaxBulkTickSquare15 />
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Badge11 />
      <Frame36 />
      <Component21 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame59 />
      <Frame60 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#b7cfe8] border-[0px_1px_0px_0px] border-dashed inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start pl-0 pr-[16px] py-[8px] relative w-full">
          <Frame30 />
          <Frame32 />
          <Frame34 />
          <Frame35 />
          <Frame37 />
        </div>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-[#ebf1f8] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-col items-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-end p-[16px] relative w-full">
          <Frame3 />
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[8px] py-0 relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['IRANSansXFaNum:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre" dir="auto">
          ایجاد پروژه
        </p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#b7cfe8] h-[48px] relative rounded-[24px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[48px] items-center justify-center px-[24px] py-[12px] relative w-full">
          <Text4 />
        </div>
      </div>
    </div>
  );
}

function Component22() {
  return (
    <div className="bg-[#9eb8d4] content-stretch flex flex-col h-[52px] items-start relative rounded-[24px] shrink-0 w-[200px]" data-name="Component 4">
      <Button />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Component22 />
    </div>
  );
}

export default function Frame13() {
  return (
    <div className="bg-white relative rounded-[24px] size-full">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[40px] items-center overflow-clip px-[24px] py-[40px] relative size-full">
          <Frame44 />
          <Frame16 />
          <Frame17 />
          <Frame38 />
          <Frame />
        </div>
      </div>
    </div>
  );
}