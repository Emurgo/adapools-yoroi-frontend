// @flow

export type SelectedPools = Array<string>

export const Source = Object.freeze({
  CHROME_EXTENSION: 'chrome',
  FIREFOX_EXTENSION: 'firefox',
  MOBILE: 'mobile',
})
export type SourceType = $Values<typeof Source>

const relevantDataForYoroi = (selectedPools: SelectedPools) => {
  return encodeURI(JSON.stringify(selectedPools))
}

export type YoroiCallbackProps = {|
    source: ?string,
    chromeId: ?string,
    mozId: ?string,
|}

export const YoroiCallback = (selectedPools: SelectedPools, yoroiCBProps: YoroiCallbackProps): void => {
  const { source } = yoroiCBProps;

  let postMessage
  const encodedDataForYoroi = relevantDataForYoroi(selectedPools)
  switch (source) {
  case Source.CHROME_EXTENSION:
    window.parent.postMessage(
      encodedDataForYoroi,
      `chrome-extension://${yoroiCBProps.chromeId ?? ''}/main_window.html#/staking`
    )
    break
  case Source.FIREFOX_EXTENSION:
    window.parent.postMessage(
      encodedDataForYoroi,
      `moz-extension://${yoroiCBProps.mozId ?? ''}/main_window.html#/staking`
    )
    break
  case Source.MOBILE:
    postMessage = window.parent.postMessage
    if (window.ReactNativeWebView) {
      postMessage = function postToReactNative (data, _targetOrigin) {
        window.ReactNativeWebView.postMessage(data)
      }
    }
    postMessage(encodedDataForYoroi, 'yoroi://simple-staking/selection')
    break
  default:
    window.parent.postMessage(encodedDataForYoroi, source)
    break
  }
}