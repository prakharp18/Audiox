"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ArrowDown01Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";

const FAQItem = ({ value, trigger, content }: { value: string; trigger: string; content: string }) => (
  <Accordion.Item value={value} className="border-b border-zinc-800/50 last:border-0 overflow-hidden">
    <Accordion.Header className="flex">
      <Accordion.Trigger className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:text-white text-zinc-400 data-[state=open]:text-white group"
      )}>
        {trigger}
        <ArrowDown01Icon className="w-4 h-4 text-zinc-600 transition-transform duration-300 group-data-[state=open]:rotate-180 group-hover:text-zinc-400" />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="text-zinc-500 text-xs overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
      <div className="pb-4 leading-relaxed opacity-80">
        {content}
      </div>
    </Accordion.Content>
  </Accordion.Item>
);

export const PublicFAQ = () => {
  return (
    <div className="w-full">
      <Accordion.Root type="single" collapsible className="w-full">
        <FAQItem 
          value="item-1" 
          trigger="Is my voice disguised?" 
          content="No, your voice is sent exactly as recorded. However, we do not link it to your name, IP, or device. It's completely anonymous." 
        />
        <FAQItem 
          value="item-2" 
          trigger="Can they find out who I am?" 
          content="Only if you reveal your identity in the message itself. We scrape no personal data. Your secrets are safe with us." 
        />
        <FAQItem 
          value="item-3" 
          trigger="Do messages expire?" 
          content="Messages are kept until the recipient deletes them. If they delete their account, all messages are wiped permanently." 
        />
        <FAQItem 
          value="item-4" 
          trigger="Is there a limit?" 
          content="Yes, to prevent spam, you can send 3 messages per user per day. Quality over quantity." 
        />
        <FAQItem
          value="item-5"
          trigger="Want to send more anonymous messages?"
          content="We currently allow only 3 messages per user per day. For unlimited anonymous messaging and enhanced privacy, switch to Vox."
        />
        <FAQItem 
          value="item-6" 
          trigger="When does the daily limit reset?" 
          content="The daily limit resets every day at 5:30 AM IST (Midnight UTC)." 
        />
      </Accordion.Root>
    </div>
  );
};