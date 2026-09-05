// Maps axe-core "wcagXYZ" tags to human-readable WCAG success criterion labels.
const WCAG_LABELS = {
  wcag111: '1.1.1 Non-text Content',
  wcag121: '1.2.1 Audio-only and Video-only (Prerecorded)',
  wcag122: '1.2.2 Captions (Prerecorded)',
  wcag123: '1.2.3 Audio Description or Media Alternative (Prerecorded)',
  wcag124: '1.2.4 Captions (Live)',
  wcag125: '1.2.5 Audio Description (Prerecorded)',
  wcag131: '1.3.1 Info and Relationships',
  wcag132: '1.3.2 Meaningful Sequence',
  wcag133: '1.3.3 Sensory Characteristics',
  wcag134: '1.3.4 Orientation',
  wcag135: '1.3.5 Identify Input Purpose',
  wcag141: '1.4.1 Use of Color',
  wcag142: '1.4.2 Audio Control',
  wcag143: '1.4.3 Contrast (Minimum)',
  wcag144: '1.4.4 Resize Text',
  wcag145: '1.4.5 Images of Text',
  wcag1410: '1.4.10 Reflow',
  wcag1411: '1.4.11 Non-text Contrast',
  wcag1412: '1.4.12 Text Spacing',
  wcag1413: '1.4.13 Content on Hover or Focus',
  wcag211: '2.1.1 Keyboard',
  wcag212: '2.1.2 No Keyboard Trap',
  wcag214: '2.1.4 Character Key Shortcuts',
  wcag221: '2.2.1 Timing Adjustable',
  wcag222: '2.2.2 Pause, Stop, Hide',
  wcag231: '2.3.1 Three Flashes or Below Threshold',
  wcag241: '2.4.1 Bypass Blocks',
  wcag242: '2.4.2 Page Titled',
  wcag243: '2.4.3 Focus Order',
  wcag244: '2.4.4 Link Purpose (In Context)',
  wcag245: '2.4.5 Multiple Ways',
  wcag246: '2.4.6 Headings and Labels',
  wcag247: '2.4.7 Focus Visible',
  wcag251: '2.5.1 Pointer Gestures',
  wcag252: '2.5.2 Pointer Cancellation',
  wcag253: '2.5.3 Label in Name',
  wcag254: '2.5.4 Motion Actuation',
  wcag311: '3.1.1 Language of Page',
  wcag312: '3.1.2 Language of Parts',
  wcag321: '3.2.1 On Focus',
  wcag322: '3.2.2 On Input',
  wcag323: '3.2.3 Consistent Navigation',
  wcag324: '3.2.4 Consistent Identification',
  wcag331: '3.3.1 Error Identification',
  wcag332: '3.3.2 Labels or Instructions',
  wcag333: '3.3.3 Error Suggestion',
  wcag334: '3.3.4 Error Prevention (Legal, Financial, Data)',
  wcag411: '4.1.1 Parsing',
  wcag412: '4.1.2 Name, Role, Value',
  wcag413: '4.1.3 Status Messages',
};

function wcagCriterionFromTags(tags = []) {
  const tag = tags.find((t) => WCAG_LABELS[t]);
  if (tag) return WCAG_LABELS[tag];
  const genericTag = tags.find((t) => /^wcag\d+$/.test(t));
  return genericTag ? genericTag.replace('wcag', 'WCAG ') : 'Best Practice';
}

module.exports = { wcagCriterionFromTags };
