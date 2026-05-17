import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): State {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info });
    // Para debug — aparece como string visible en consola
    console.warn("[ErrorBoundary]", error.message, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 32,
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 12,
            color: "var(--red-dark, #991b1b)",
            background: "var(--red-soft, #fee2e2)",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Error de renderizado</h2>
          <strong>{this.state.error.message}</strong>
          <hr />
          <pre>{this.state.error.stack}</pre>
          {this.state.info && (
            <>
              <hr />
              <pre>{this.state.info.componentStack}</pre>
            </>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
