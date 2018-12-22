/*
 * Page d'acceuil
 * Le but de cette page est de permettre aux utilisateurs :
 * - de comprendre l'objectif de la plateforme
 * - d'accéder rapidement à la page d'exploration
 * - d'accèder rapidement à la page d'inscription
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../components'

export const HomePage = () => (
  <Page title="Accueil">
    <div className="notification is-warning has-text-centered">
      <p>
        <strong>Version alpha</strong> ouverte depuis le 2 Janvier 2019
        uniquement pour les mails se terminant par @zenika.com
      </p>
      <p>
        Pour participer au développement, vous pouvez rejoindre le channel{' '}
        <strong>#emendare</strong> sur le slack Zenika
      </p>
    </div>

    <div className="field has-text-centered">
      <h1 className="is-size-3">
        Plateforme open source de rédaction de textes amendables
      </h1>
      <h2 className="is-size-5">
        Un amendement est une modification d'un texte, soumise au vote d'un
        groupe
      </h2>
    </div>
    <div className="field is-grouped is-grouped-centered">
      <p className="control">
        <Link to="/explore" className="button is-medium is-info">
          Découvrir Emendare
        </Link>
      </p>
      <p className="control">
        <Link to="/login" className="button is-medium is-primary">
          Créer votre compte
        </Link>
      </p>
    </div>
  </Page>
)