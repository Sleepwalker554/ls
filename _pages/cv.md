---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

[Download CV]({{ base_path }}/Luqi_CV.pdf)

<div id="cv-viewer" class="cv-viewer"><p>Loading CV…</p></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
(function () {
  var url = "{{ base_path }}/Luqi_CV.pdf";
  var container = document.getElementById("cv-viewer");
  var fallback = '<p>The CV could not be displayed here. <a href="' + url + '">Download CV</a></p>';
  if (!window.pdfjsLib) { container.innerHTML = fallback; return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  var pdfDoc = null, lastWidth = 0, resizeTimer;
  function renderPages() {
    var width = container.clientWidth;
    if (!pdfDoc || !width || width === lastWidth) return;
    lastWidth = width;
    container.innerHTML = "";
    var ratio = window.devicePixelRatio || 1;
    var chain = Promise.resolve();
    for (var n = 1; n <= pdfDoc.numPages; n++) {
      chain = chain.then(renderPage.bind(null, n, width, ratio));
    }
  }
  function renderPage(n, width, ratio) {
    var canvas = document.createElement("canvas");
    canvas.className = "cv-viewer__page";
    container.appendChild(canvas);
    return pdfDoc.getPage(n).then(function (page) {
      var viewport = page.getViewport({ scale: width * ratio / page.getViewport({ scale: 1 }).width });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      return page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise;
    });
  }
  pdfjsLib.getDocument(url).promise.then(function (doc) {
    pdfDoc = doc;
    renderPages();
  }, function () { container.innerHTML = fallback; });
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderPages, 200);
  });
})();
</script>

{% comment %}
Previous text-based CV, hidden while the PDF viewer above is in use.
To roll back: delete the viewer above (from the div through the closing script tag)
and remove this comment wrapper.

Education
======
* Master of Science in Engineering (M.S.E.) in Electrical and Computer Engineering, **Johns Hopkins University**, Aug 2025 – Present
  * GPA: 3.47/4.0
* **Dalian University of Technology**, Bachelor’s degree in Digital Media Technology, Sep 2021 – Jun 2025
  * Major GPA: 88.49/100

Research Experience
======
* **Aug 2025 – Present: Research Assistant, Johns Hopkins University**
  * [SMILE Lab](https://sites.google.com/view/jhusmile/homepage), affiliated with the [Center for Language and Speech Processing (CLSP)](https://www.clsp.jhu.edu/)
  * Advisor: Prof. [Berrak Sisman](https://engineering.jhu.edu/faculty/berrak-sisman/)
  * Research focus: Deep learning based speech and language processing

* **Feb 2024 – May 2025: Research Assistant, Dalian University of Technology**
  * Advisor: Prof. [Qiufen Xia](https://faculty.dlut.edu.cn/qfx/zh_CN/index.htm)
  * Research focus: Cold start latency optimization in serverless computing

Publications & Patents
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
{% endcomment %}
