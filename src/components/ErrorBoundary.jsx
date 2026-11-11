import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="render-error">
        <h2>Could not render this paper</h2>
        <p>The JSON is valid but contains something the layout engine could not handle. Check the structure against the schema on the home page.</p>
        <pre>{String(this.state.error.message || this.state.error)}</pre>
      </div>
    )
  }
}
