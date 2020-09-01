const defaults = {
  name: "Unnamed"
}

export default class Preferences {
  static load() {
    const preferences = Object.assign({}, defaults)
    const item = localStorage.getItem("preferences")
    if (typeof item !== "string") {
      return preferences
    }
    const data = JSON.parse(item)
    Object.assign(preferences, data)
    return preferences
  }

  static update(values) {
    values = Object.assign({}, this.load(), values)
    localStorage.setItem("preferences", JSON.stringify(values))
  }
}
