import { makeAutoObservable } from "mobx";

export default class Store {
  constructor() {
    this.state = {
      isLoading: false,
      currentContext: "",
      currentMode: "none",
      shouldUpdateSourceList: false,
      shouldUpdateContextList: false,
    };
    makeAutoObservable(this);
  }

  setIsLoading(value) {
    this.state.isLoading = value;
  }

  setCurrentContext(value) {
    this.state.currentContext = value;
  }

  setChosenDataUrl(value) {
    this.state.chosenDataUrl = value;
  }

  setShouldUpdateSourceList(value) {
    this.state.shouldUpdateSourceList = value;
  }
  setShouldUpdateContextList(value) {
    this.state.shouldUpdateContextList = value;
  }

  setCurrentMode(value) {
    this.state.currentMode = value;
  }
}
