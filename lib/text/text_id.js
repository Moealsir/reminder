const prefix = require('../../settings').prefix;

const menu = `
*عنتَر.* 
تم تطويره بواسطة
*_Cohort19_*

👨🏻‍💻 رسالة المطورين 👨🏻‍💻
هل لديك نقد/اقتراح أو ترغب في طلب ميزة؟ أو تريد أن تسأل عن البوتات؟ يرجى مراسلة فريق دعم البوت

📝 الارشادات 📝
استخدم الأمر *${prefix}rules* للاطلاع على قواعد استخدام البوتات و *${prefix}faq* للاطلاع على بعض الإجابات لبعض الأسئلة الشائعة.
 
🚀 الاوامر 🚀

*👥 اوامر المجموعات 👥*

${prefix}kickall
${prefix}add [249...]
${prefix}kick [@mention]
⌖ ${prefix}promote [@mention]
${prefix}demote [@mention]
${prefix}revoke
${prefix}link
${prefix}silent [on|off]

${prefix}ping
${prefix}groupstats
${prefix}kickme
${prefix}mystats


*👤 الاوامر العامة 👤*
قريباً
*🎲 اوامر التسلية 🎲*
قريباً
*🎓 الاوامر التعليمية 🎓*
قريباً
*🎵 اوامر الموسيقى 🎵*
قريباً
*🌚 اوامر اخرى 🌚*
قريباً
`;
module.exports = { menu};
