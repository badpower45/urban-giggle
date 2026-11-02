import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { usePlatformStore } from '../../lib/platformStore';
import { TicketCategory, TicketPriority } from '../../types/admin';
import { ShieldAlert, Send } from 'lucide-react';
import { useToast } from './Toast';
import { supabaseService } from '../../lib/supabase/client';

interface SubmitComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFirmName?: string;
  defaultUserName?: string;
}

export const SubmitComplaintModal: React.FC<SubmitComplaintModalProps> = ({
  open,
  onOpenChange,
  defaultFirmName = 'مكتب الأمل للمحاماة',
  defaultUserName = 'أحمد محمود',
}) => {
  const { addComplaint } = usePlatformStore();
  const { showToast } = useToast();

  const [firmName, setFirmName] = useState(defaultFirmName);
  const [userName, setUserName] = useState(defaultUserName);
  const [phone, setPhone] = useState('01012345678');
  const [email, setEmail] = useState('lawyer@baseera.legal');
  const [category, setCategory] = useState<TicketCategory>('technical');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    addComplaint({
      firm_name: firmName,
      user_name: userName,
      user_phone: phone,
      user_email: email,
      category,
      priority,
      subject: subject.trim(),
      message: message.trim(),
    });

    if (supabaseService.isConfigured()) {
      supabaseService.submitTicket({
        user_name: userName,
        user_email: email,
        subject: subject.trim(),
        category,
        message: message.trim(),
      }).catch((err) => console.warn('[Supabase] Ticket sync warning:', err));
    }

    onOpenChange(false);
    setSubject('');
    setMessage('');
    showToast('تم إرسال تذكرتك بنجاح للإدارة العليا وسيتم التواصل معك سريعاً', 'success');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-6 text-primary" dir="rtl">
        <DialogHeader className="space-y-1.5 text-right border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <DialogTitle className="text-base font-bold">
              إرسال شكوى أو استفسار للإدارة والدعم الفني
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            تصل تذكرتك مباشرة إلى لوحة الإدارة العليا لمتابعتها والرد عليها فوراً.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-right">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold">تصنيف التذكرة</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full text-xs h-9 px-3 rounded-lg border border-border bg-white"
              >
                <option value="technical">مشكلة فنية أو عطل</option>
                <option value="billing">استفسار فواتير واشتراك</option>
                <option value="inquiry">سؤال أو استفسار قانوني</option>
                <option value="feature_request">اقتراح ميزة جديدة</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">درجة الأهمية</Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full text-xs h-9 px-3 rounded-lg border border-border bg-white"
              >
                <option value="low">عادية</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">طارئة وعاجلة جداً</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="ticket-subject" className="text-xs font-bold">
              عنوان الموضوع أو الشكوى *
            </Label>
            <Input
              id="ticket-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="اكتب عنواناً مختصراً للمشكلة..."
              required
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="ticket-msg" className="text-xs font-bold">
              تفاصيل الرسالة أو الاستفسار *
            </Label>
            <Textarea
              id="ticket-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اشرح المشكلة أو الاستفسار بالتفصيل..."
              rows={4}
              required
              className="text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground font-semibold">رقم التواصل للرد</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs h-8 font-mono"
                dir="ltr"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground font-semibold">البريد الإلكتروني</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-8 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 text-xs"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white h-9 text-xs font-bold gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال التذكرة للإدارة</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
