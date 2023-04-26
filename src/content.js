import { LitElement, html, css } from "lit";

export default class Content extends LitElement {
  static styles = css`
    .demo {
      color: green;
    }
  `;

  render() {
    return html`<section class="demo">This is a demo</section>`;
  }
}
customElements.define('simple-test', Content);