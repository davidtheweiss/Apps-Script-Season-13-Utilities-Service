function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
  .setTitle('Register for UPenn Commencement')
  .setFaviconUrl('https://branding.web-resources.upenn.edu/sites/default/files/simplified-shield-final%20%285%29.png');
}

function createNewSlide(name, school, quote, photoData) {
  const slides = SlidesApp.openById('1rh_gcZ04IXbZPORxrvQdN7ER_dFLuYsN1Fh-xWxIEX0');
  let slide = slides.appendSlide(slides.getLayouts()[11]);
  slide.getPlaceholder(SlidesApp.PlaceholderType.TITLE).asShape().getText().setText(name);
  slide.getPlaceholder(SlidesApp.PlaceholderType.SUBTITLE).asShape().getText().setText(school);
  slide.getPlaceholder(SlidesApp.PlaceholderType.BODY).asShape().getText().setText(quote);
  
  const image = Utilities.newBlob(photoData.bytes);
  slide.insertImage(image, 70, 60, 220, 220);
}

function includeExternalFile(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
