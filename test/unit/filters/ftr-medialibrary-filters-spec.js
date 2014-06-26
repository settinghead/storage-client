/*jshint expr:true */

describe("Filters: lastModifiedFilter", function() {
  "use strict";

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

  it("should extract file type", inject(function ($filter) {
    expect($filter("fileTypeFilter")("hello.txt")).to.equal("TXT");
    expect($filter("fileTypeFilter")("4g43g43gj34iogj43iogj34ig4j3g4i3.jpeg")).to.equal("JPEG");
    expect($filter("fileTypeFilter")("dash-and.dot-in.file.name.xml")).to.equal("XML");
    expect($filter("fileTypeFilter")("no.extension")).to.equal("");
    expect($filter("fileTypeFilter")("noextension")).to.equal("");
  }));
});

describe("Filters: fileSizeFilter", function() {

  beforeEach(module("medialibraryFilters"));

  it("should exist", function(done) {
    inject(function($filter) {
      expect($filter("fileSizeFilter")).be.defined;
      done();
    });
  });

  it("should format file size", inject(function ($filter) {
    expect($filter("fileSizeFilter")(0)).to.equal("0 bytes");
    expect($filter("fileSizeFilter")(200)).to.equal("200 bytes");
    expect($filter("fileSizeFilter")(2 * 1024)).to.equal("2 KB");
    expect($filter("fileSizeFilter")(1023 * 1024)).to.equal("1023 KB");
    expect($filter("fileSizeFilter")(3 * 1024 * 1024)).to.equal("3 MB");
    expect($filter("fileSizeFilter")(5 * 1024 * 1024 + 600 * 1024)).to.equal("5.5 MB");
    expect($filter("fileSizeFilter")(17 * 1024 * 1024 * 1024)).to.equal("17 GB");
    expect($filter("fileSizeFilter")(23 * 1024 * 1024 * 1024 + 700 * 1024 * 1024)).to.equal("23.6 GB");
    expect($filter("fileSizeFilter")(2002 * 1024 * 1024 * 1024)).to.equal("2002 GB");
  }));
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


describe("Filters: lastModifiedFilter", function() {
  beforeEach(module("medialibraryFilters"));
  it("should exist", function(done) {
    inject(function($filter) {
      expect($filter("lastModifiedFilter")).be.defined;
      done();
    });
  });

  xit("should format last modified date", inject(function ($filter) {
    //TODO
    // I don't fully understand the logic of this filter, so I thought I'd better
    // leave it to the dev team to finish this. - Xiyang 
    expect($filter("lastModifiedFilter")()).to.equal(null);
    expect($filter("lastModifiedFilter")(new Date("2002-12-11").getTime())).to.equal("2002-12-11");
    expect($filter("lastModifiedFilter")(new Date("2022-03-11").getTime())).to.equal("200 bytes");
    expect($filter("lastModifiedFilter")(new Date("2014-10-11").getTime())).to.equal("2 KB");
    expect($filter("lastModifiedFilter")(new Date().getTime())).to.equal("2 KB");
  }));
});