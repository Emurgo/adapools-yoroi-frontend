// @flow

export type SelectedPools = Array<{|poolHash: string|}>

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
  const { value: source } = yoroiCBProps.source;
  const { value: chromeId } = yoroiCBProps.chromeId;
  const { value: mozId } = yoroiCBProps.mozId;

  let postMessage
  const encodedDataForYoroi = relevantDataForYoroi(selectedPools)
  switch (source) {
  case Source.CHROME_EXTENSION:
    window.parent.postMessage(
      encodedDataForYoroi,
      `chrome-extension://${chromeId}/main_window.html#/staking`
    )
    break
  case Source.FIREFOX_EXTENSION:
    window.parent.postMessage(
      encodedDataForYoroi,
      `moz-extension://${mozId}/main_window.html#/staking`
    )
    break
  case Source.MOBILE:
    postMessage = window.parent.postMessage
    if (window.ReactNativeWebView) {
      postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data)
      }
    }
    postMessage(encodedDataForYoroi, 'yoroi://simple-staking/selection')
    break
  default:
    console.log('Pool Selected for Yoroi: ')
    console.log(encodedDataForYoroi)
    window.parent.postMessage(encodedDataForYoroi, source)
    break
  }
}