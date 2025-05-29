"use strict";

import * as trie from "./trie.js";

var NotImplemented = function (name) {
  return {
    name: "NotImplementedException",
    message: "method '" + name + "' not implemented",
  };
};

export class BaseStore {
  // "abstract" methods
  getTarget(path) {
    throw NotImplemented("getTarget");
  }
  getAll() {
    throw NotImplemented("getAll");
  }
  add(path, data) {
    throw NotImplemented("add");
  }
  update(path, data) {
    throw NotImplemented("update");
  }
  remove(path) {
    throw NotImplemented("remove");
  }

  async get(path) {
    // default get implementation derived from getAll
    // only needs overriding if a more efficient implementation is available
    path = this.cleanPath(path);
    const routes = await this.getAll();
    return routes[path];
  }

  cleanPath(path) {
    return trie.trimPrefix(path);
  }
}

export class MemoryStore extends BaseStore {
  constructor() {
    super();
    this.routes = {};
    this.urls = new trie.URLTrie();
  }

  async get(path) {
    return this.routes[this.cleanPath(path)];
  }

  async getTarget(path) {
    return this.urls.get(path);
  }

  async getAll() {
    return this.routes;
  }

  async add(path, data) {
    path = this.cleanPath(path);
    this.routes[path] = data;
    this.urls.add(path, data);
  }

  async update(path, data) {
    Object.assign(this.routes[this.cleanPath(path)], data);
  }

  async remove(path) {
    path = this.cleanPath(path);
    const route = this.routes[path];
    delete this.routes[path];
    this.urls.remove(path);
    return route;
  }
}
