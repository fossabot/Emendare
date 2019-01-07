/*
 * Page de détails d'un amendement
 * Le but de cette page est de permettre aux utilisateurs :
 * - d'accéder au détail d'un amendement
 * - TODO : de visualiser le vote de l'amendement
 * - TODO : de participer au vote sur l'amendement
 */

import React from 'react'
import {
  Amend,
  Box,
  Button,
  Buttons,
  Column,
  Columns,
  ErrorPage,
  Icon,
  Notification,
  Page,
  Results,
  UserContext
} from '../../components'
import { socket } from '../../services'
import diff_match_patch from 'diff-match-patch'
import { path } from '../../config'

export class AmendPage extends React.Component {
  constructor(props) {
    super(props)

    this.upVote = () => {
      socket
        .fetch('upVoteAmend', { id: this.props.match.params.id })
        .then(amend => {
          socket.emit('user')
          this.setState({ amend, error: null }, () => {
            this.computeDiff()
          })
        })
    }

    this.downVote = () => {
      socket
        .fetch('downVoteAmend', { id: this.props.match.params.id })
        .then(amend => {
          socket.emit('user')
          this.setState({ amend, error: null }, () => {
            this.computeDiff()
          })
        })
    }

    this.unVote = () => {
      socket
        .fetch('unVoteAmend', { id: this.props.match.params.id })
        .then(amend => {
          socket.emit('user')
          this.setState({ amend, error: null }, () => {
            this.computeDiff()
          })
        })
    }

    this.convertMsToTime = ms => {
      const sec = Math.floor(ms / 1000)
      const hrs = Math.floor(sec / 3600)
      const mins = Math.floor((sec - 3600 * hrs) / 60)

      return hrs + ' heures et ' + mins + ' minutes'
    }

    this.state = {
      index: 0,
      amend: null,
      error: null
    }
  }

  fetchData() {
    socket
      .fetch('amend', { id: this.props.match.params.id })
      .then(amend => {
        this.setState({ amend }, () => {
          this.computeDiff()
          socket.emit('user')
        })
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  componentDidMount() {
    this.fetchData()

    socket.on('amend/' + this.props.match.params.id, ({ error, data }) => {
      if (!error) {
        this.setState({ amend: data }, () => {
          this.computeDiff()
          socket.emit('user')
        })
      }
    })

    this.interval = setInterval(() => {
      this.setState({ index: this.state.index + 1 })
    }, 10 * 1000)
  }

  componentWillUnmount() {
    socket.off('amend')
    socket.off('amend/' + this.props.match.params.id)
    clearInterval(this.interval)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData()
    }
  }

  computeDiff() {
    const dmp = new diff_match_patch()
    dmp.Diff_EditCost = 8

    let previousText = ''

    for (let index = 0; index < this.state.amend.version; index++) {
      const patch = this.state.amend.text.patches[index]
      previousText = dmp.patch_apply(dmp.patch_fromText(patch), previousText)[0]
    }

    const newText = dmp.patch_apply(
      dmp.patch_fromText(this.state.amend.patch),
      previousText
    )[0]

    const diffs = dmp.diff_main(previousText, newText)
    dmp.diff_cleanupEfficiency(diffs)
    this.setState({ amend: { diffs, ...this.state.amend } })
  }

  getTitle() {
    return this.state.amend
      ? 'Amendement sur ' +
          this.state.amend.text.name +
          ' : ' +
          this.state.amend.name
      : 'Amendement'
  }

  render() {
    if (this.state.error) return <ErrorPage error={this.state.error} />

    return (
      <Page title={this.getTitle()}>
        <UserContext.Consumer>
          {({ user }) => (
            <>
              {this.state.amend && (
                <>
                  <Buttons>
                    <Button to={path.text(this.state.amend.text._id)}>
                      <Icon type="fas fa-chevron-left" />
                      <span>Retour au texte</span>
                    </Button>
                  </Buttons>
                  <Columns>
                    <Column>
                      <Amend data={this.state.amend} />
                    </Column>
                    <Column>
                      <Notification className="is-info">
                        <p>
                          Le vote est{' '}
                          <span className="has-text-weight-semibold">
                            clos à la fin du temps imparti
                          </span>{' '}
                          ou dès lors qu'une majorité absolue est atteinte après
                          un delai minimum d'une heure. Le{' '}
                          <span className="has-text-weight-semibold">
                            vote est liquide
                          </span>
                          , ce qui veut dire que vous pouvez changer votre vote
                          jusqu'à la fin du scrutin.
                        </p>
                      </Notification>
                      <Box key={this.state.index}>
                        <p className="is-size-5 has-text-centered has-text-weight-semibold">
                          Scrutin{' '}
                          {this.state.amend.closed ? 'clos' : 'en cours'} sur
                          l'amendement présenté ci-contre
                        </p>

                        {!this.state.amend.closed && (
                          <p className="has-text-centered">
                            Temps restant avant la fin du scrutin :{' '}
                            <span className="has-text-weight-semibold">
                              {this.convertMsToTime(
                                -Math.floor(
                                  new Date().getTime() -
                                    (new Date(
                                      this.state.amend.created
                                    ).getTime() +
                                      this.state.amend.delayMax)
                                )
                              )}
                            </span>
                          </p>
                        )}

                        <hr />

                        {this.state.amend.upVotesCount +
                          this.state.amend.downVotesCount >
                        0 ? (
                          <>
                            <Results
                              value={
                                Math.round(
                                  (10 * (100 * this.state.amend.upVotesCount)) /
                                    (this.state.amend.upVotesCount +
                                      this.state.amend.downVotesCount)
                                ) / 10
                              }
                            />
                            <p className="has-text-centered">
                              {this.state.amend.upVotesCount +
                                this.state.amend.downVotesCount}{' '}
                              vote
                              {this.state.amend.upVotesCount +
                                this.state.amend.downVotesCount >
                              1
                                ? 's'
                                : ''}{' '}
                              exprimé
                              {this.state.amend.upVotesCount +
                                this.state.amend.downVotesCount >
                              1
                                ? 's'
                                : ''}
                            </p>
                          </>
                        ) : (
                          <p className="has-text-centered">
                            Aucun vote n'est encore enregistré pour ce scrutin
                          </p>
                        )}

                        <hr />

                        {user &&
                          user.followedTexts.find(
                            followedText =>
                              this.state.amend.text._id === followedText._id
                          ) && (
                            <>
                              <Buttons className="is-fullwidth">
                                <Button
                                  className={
                                    user.upVotes.find(
                                      id => id === this.state.amend._id
                                    )
                                      ? 'is-success'
                                      : 'is-light'
                                  }
                                  disabled={this.state.amend.closed}
                                  onClick={this.upVote}
                                  style={{ flex: 1 }}
                                >
                                  Voter pour
                                </Button>
                                <Button
                                  className={
                                    !user.upVotes.find(
                                      id => id === this.state.amend._id
                                    ) &&
                                    !user.downVotes.find(
                                      id => id === this.state.amend._id
                                    )
                                      ? 'is-dark'
                                      : 'is-light'
                                  }
                                  disabled={this.state.amend.closed}
                                  onClick={this.unVote}
                                  style={{ flex: 1 }}
                                >
                                  S'abstenir
                                </Button>
                                <Button
                                  className={
                                    user.downVotes.find(
                                      id => id === this.state.amend._id
                                    )
                                      ? 'is-danger'
                                      : 'is-light'
                                  }
                                  disabled={this.state.amend.closed}
                                  onClick={this.downVote}
                                  style={{ flex: 1 }}
                                >
                                  Voter contre
                                </Button>
                              </Buttons>
                            </>
                          )}

                        {user &&
                          !this.state.amend.closed &&
                          !user.followedTexts.find(
                            followedText =>
                              this.state.amend.text._id === followedText._id
                          ) && (
                            <>
                              <p className="has-text-centered has-text-weight-semibold has-text-danger">
                                Vous devez participer au texte visé par cet
                                amendement pour pouvoir participer à ce scrutin
                                et / ou proposer d'autres amendements.
                              </p>
                            </>
                          )}

                        {this.state.amend.closed && (
                          <>
                            <p className="has-text-centered has-text-weight-semibold has-text-danger">
                              Le scrutin est clos. L'amendement a été{' '}
                              {this.state.amend.accepted ? 'accepté' : 'refusé'}{' '}
                              par les participants.
                            </p>

                            {this.state.amend.conflicted && (
                              <>
                                <br />
                                <p className="has-text-centered has-text-weight-semibold">
                                  Mais des conflits ont été détectés à
                                  l'application de l'amendement. Une nouvelle
                                  fonctionalité permettra prochainement aux
                                  auteurs des amendements de corriger ces
                                  conflits avant les scrutins.
                                </p>
                              </>
                            )}
                          </>
                        )}
                      </Box>
                    </Column>
                  </Columns>
                </>
              )}
            </>
          )}
        </UserContext.Consumer>
      </Page>
    )
  }
}
