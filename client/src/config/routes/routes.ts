import { ComponentClass } from 'react'

// For paths like that for example : /text/:id
export const withID = (pathname: string) => (id = ':id') => pathname + id

export interface IRoute {
  name: string
  path: string | ((id?: string) => string)
  exact?: boolean
  private?: boolean
  component?: ComponentClass<any, any>
}

// All application routes
export const routes: IRoute[] = [
  { name: 'home', path: '/', exact: true },
  { name: 'news', path: '/actualites' },
  { name: 'code', path: '/charte-ethique' },
  { name: 'legal', path: '/mentions-legales' },
  { name: 'contributors', path: '/contributeurs' },
  { name: 'login', path: '/connexion' },
  { name: 'reset', path: '/reset-password' },
  { name: 'subscribe', path: '/inscription' },
  { name: 'profile', path: '/profil', private: true },
  { name: 'text', path: withID('/texte/') },
  { name: 'edit', path: withID('/editer/'), private: true },
  { name: 'amend', path: withID('/amendement/') },
  { name: 'activate', path: withID('/activation/') }
]

// To be use like that : path.text("42") => /text/42
export const path: any = routes.reduce(
  (acc, route) => ({ ...acc, [route.name]: route.path }),
  {}
)
