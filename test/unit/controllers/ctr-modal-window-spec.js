"use strict";
describe("ModalWindowController", function() {
  beforeEach(module("medialibrary"));

  var ModalWindowController
     ,scope = {};

  beforeEach(inject(function($controller) {
    ModalWindowController = $controller("ModalWindowController"
                                       ,{$scope: scope});
  }));

  it("should be defined", function() {
    expect(ModalWindowController).to.exist;
  });

  it("should should provide a modal close function ", function() {
    expect(scope.closeButtonClick).to.exist;
  });
});
