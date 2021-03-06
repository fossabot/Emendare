import React from 'react'
import { Socket } from '../../../services'

export const UserContext = React.createContext({} as IUserProviderState)

interface IUserProviderState {
  user: any
  isConnectionPending: boolean
  isConnected: any
  logout: any
}

export class UserProvider extends React.Component<{}, IUserProviderState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      user: null,
      isConnectionPending: true,
      isConnected: () => this.state.user !== null,
      logout: async (event: any) => {
        event.preventDefault()
        await Socket.fetch('logout')
        localStorage.removeItem('token')
        this.setState(() => ({ user: null }))
      }
    }
  }

  public componentDidMount() {
    Socket.on('user', ({ error, data }: any) => {
      if (!error) {
        this.setState({ user: data })
      }
    })

    const token = localStorage.getItem('token')
    if (token) {
      this.setState({ isConnectionPending: true })
      Socket.fetch('login')
        .then(user => {
          this.setState({ user, isConnectionPending: false })
        })
        .catch(() => {
          localStorage.removeItem('token')
          this.setState({ isConnectionPending: false })
        })
    } else {
      this.setState({ isConnectionPending: false })
    }
  }

  public componentWillUnmount() {
    Socket.off('user')
    Socket.off('login')
  }

  public render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}
