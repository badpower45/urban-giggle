import React, { useState } from 'react';
import { usePlatformStore } from '../../../lib/platformStore';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { useToast } from '../../../components/common/Toast';
import { Send, CheckCircle2, Phone, MessageSquare, Sparkles } from 'lucide-react';

export const LandingContactForm: React.FC = () => {
  const { addLead, settings } = usePlatformStore();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [teamSize, setTeamSize] = useState('2-5');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    addLead({
      full_name: fullName.trim(),
      firm_name: firmName.trim() || 'مكتب محاماة خاص',
      phone: phone.trim(),
      email: email.trim() || 'لم يُحدد',
      city,
      team_size: teamSize,
      message: message.trim() || 'طلب تواصل وتجربة النظام مجاناً لمدة 14 يوماً.',
    });

    setSubmitted(true);
    showToast('تم إرسال طلبك بنجاح للإدارة، سنتواصل معك خلال دقائق!', 'success');
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 animate-in fade-in-50 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-emerald-950 font-headline">
          تم استلام طلبك بنجاح أستاذ {fullName}!
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
          فريق الاستشارات القانونية والإدارة العليا في {settings.systemName} سيقوم بالتواصل معك هاتفياً أو عبر واتساب على الرقم ({phone}) لمساعدتك في تفعيل حسابك وحجز موعد الديمو.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="text-xs h-9 border-emerald-300 text-emerald-900"
          >
            إرسال استفسار آخر
          </Button>

          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
              `مرحباً، أرسلت طلباً لتجربة نظام ${settings.systemName} باسم ${fullName}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
          >
            <span>متابعة فورية عبر واتساب</span>
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-border shadow-xl p-6 sm:p-10 max-w-2xl mx-auto text-right space-y-4" dir="rtl">
      <div className="text-center space-y-1 pb-2 border-b border-border/60">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          طلب تواصل واستفسار مباشر
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-primary font-headline">
          احجز عرضاً توضيحياً مجانياً لمكتبك
        </h3>
        <p className="text-xs text-muted-foreground">
          املأ بياناتك وسيقوم أحد مستشارينا بالتواصل معك لشرح النظام والإجابة عن كافة أسئلتك.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="lead-name" className="text-xs font-bold text-primary">
            الاسم واللقب الكريم *
          </Label>
          <Input
            id="lead-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="مثال: أستاذ / أحمد محمود"
            required
            className="text-xs h-10"
          />
        </div>

        {/* Firm Name */}
        <div className="space-y-1.5">
          <Label htmlFor="lead-firm" className="text-xs font-bold text-primary">
            اسم المكتب أو الشركة القانونية
          </Label>
          <Input
            id="lead-firm"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            placeholder="مثال: مكتب الأمل للمحاماة"
            className="text-xs h-10"
          />
        </div>

        {/* Phone / WhatsApp */}
        <div className="space-y-1.5">
          <Label htmlFor="lead-phone" className="text-xs font-bold text-primary">
            رقم الهاتف / واتساب *
          </Label>
          <Input
            id="lead-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="مثال: 01012345678"
            required
            dir="ltr"
            className="text-xs h-10 font-mono text-right"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="lead-email" className="text-xs font-bold text-primary">
            البريد الإلكتروني (اختياري)
          </Label>
          <Input
            id="lead-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="lawyer@example.com"
            dir="ltr"
            className="text-xs h-10 font-mono text-right"
          />
        </div>

        {/* City / Governorate */}
        <div className="space-y-1.5">
          <Label htmlFor="lead-city" className="text-xs font-bold text-primary">
            المحافظة / المدينة
          </Label>
          <select
            id="lead-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full text-xs h-10 px-3 rounded-lg border border-border bg-white text-primary focus:outline-none"
          >
            <option value="القاهرة">القاهرة</option>
            <option value="الجيزة">الجيزة</option>
            <option value="الإسكندرية">الإسكندرية</option>
            <option value="الدقهلية (المنصورة)">الدقهلية (المنصورة)</option>
            <option value="الغربية (طنطا)">الغربية (طنطا)</option>
            <option value="الشرقية (الزقازيق)">الشرقية (الزقازيق)</option>
            <option value="أسيوط">أسيوط</option>
            <option value="سوهاج">سوهاج</option>
            <option value="محافظة أخرى">محافظة أخرى / خارج مصر</option>
          </select>
        </div>

        {/* Team Size */}
        <div className="space-y-1.5">
          <Label htmlFor="lead-size" className="text-xs font-bold text-primary">
            حجم فريق العمل بالمكتب
          </Label>
          <select
            id="lead-size"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full text-xs h-10 px-3 rounded-lg border border-border bg-white text-primary focus:outline-none"
          >
            <option value="1">محامٍ فردي مستقل</option>
            <option value="2-5">٢ إلى ٥ محامين ومساعدين</option>
            <option value="6-15">٦ إلى ١٥ محامياً ومستشاراً</option>
            <option value="15+">أكثر من ١٥ محامياً (مؤسسة قانونية)</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5 pt-1">
        <Label htmlFor="lead-msg" className="text-xs font-bold text-primary">
          أي استفسار أو تفاصيل ترغب بمشاركتها معنا؟
        </Label>
        <Textarea
          id="lead-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب استفسارك أو الوقت الأنسب لتواصل فريقنا معك..."
          rows={3}
          className="text-xs resize-none"
        />
      </div>

      <div className="pt-3">
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-sm h-12 gap-2 rounded-xl shadow-md transition-all"
        >
          <Send className="w-4 h-4" />
          <span>إرسال طلب التواصل وحجز الديمو</span>
        </Button>
      </div>

      <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
        <span>✓ سرية تامة لبياناتك</span>
        <span>✓ تجربة مجانية ١٤ يوماً</span>
        <span>✓ بدون أي بطاقة بنكية</span>
      </div>
    </form>
  );
};
