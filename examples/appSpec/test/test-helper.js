import test from 'tape';

let _app = null

export const hctest = (description, fn) => {
  if (_app) {
    _app.stop()
  }
  _app = Container.loadAndInstantiate("dist/bundle.json")
  // activate the new instance
  _app.start()
  test(description, t => fn(_app, t))
}
