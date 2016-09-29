AFRAME.registerComponent('ajax-href', {
  schema: {type: 'string'},

  boundClickHandler: undefined,

  clickHandler: function hrefClickHandler() {
    var url = this.data;
    $.get(url, function (response) {
      var html = $.parseHTML(response, document, true);

      var inlineScripts = $(html.filter(function (elt) { return elt.tagName == 'SCRIPT' && elt.src == '' })).html();
      eval(inlineScripts); // DANGEROUS!

      var newScene = html.find(function (elt) { return elt.tagName == 'A-SCENE' });
      var assets = $(newScene).find('a-assets');

      $(assets).children().each(function (i, asset) {
        if ($(asset).attr('src')) {
          $(asset).attr('src', 'http://cors.io/?' + url + $(asset).attr('src'))[0]
        }
      });

      $('a-scene').children().each(function (i, elt) {
        if (elt.id.indexOf('player') == -1 && elt.tagName != 'CANVAS' && elt.tagName != 'A-ASSETS') {
          $(elt).remove();
        }
      })

      $(newScene).children().each(function (i, elt) {
        if (elt.id.indexOf('player') == -1 ) {
          $('a-scene').append(elt);
        }
      })
    });
  },


  init: function() {
    this.boundClickHandler = this.clickHandler.bind(this);
    this.el.addEventListener('click', this.boundClickHandler);
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function() {
    this.el.removeEventListener('click', this.boundClickHandler);
  }
});
