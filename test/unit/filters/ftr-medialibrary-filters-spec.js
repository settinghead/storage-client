/*jshint expr:true */
"use strict";

describe("Filters: lastModifiedFilter", function() {

  beforeEach(module("medialibraryFilters"));

  it("should exist", function(done) {
    inject(function($filter) {
      expect($filter("lastModifiedFilter")).be.defined;
      done();
    });
  });
});


describe("Filters: fileTypeFilter", function() {

  beforeEach(module("medialibraryFilters"));

  it("should exist", function(done) {
    inject(function($filter) {
      expect($filter("fileTypeFilter")).be.defined;
      done();
    });
  });
});

describe("Filters: fileSizeFilter", function() {

  beforeEach(module("medialibraryFilters"));

  it("should exist", function(done) {
    inject(function($filter) {
      expect($filter("fileSizeFilter")).be.defined;
      done();
    });
  });
});

describe("Filters: groupBy", function() {

  beforeEach(module("medialibraryFilters"));

  it("should exist", function(done) {
    inject(function($filter) {
      expect($filter("groupBy")).be.defined;
      done();
    });
  });
});