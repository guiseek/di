import {inject, register} from './di'
import './style.css'

/**
 * Esta é uma dependência
 * É ela quem nos fornece
 * dados que precisaremos
 */
class Dependencia {
  planetas = [
    'Mercúrio',
    'Vênus',
    'Terra',
    'Marte',
    'Júpiter',
    'Saturno',
    'Urano',
    'netuno',
  ]
}

/**
 * Este é um DataService
 * E ele depende de quem
 * irá fornecer os dados
 */
class DataService {
  constructor(readonly dependencia: Dependencia) {}
}

/**
 * Esta é uma abstração
 * Este não tem retorno
 * Só define o contrato
 */
abstract class Planetas {
  abstract pegaPlanetas(): string[]
}

/**
 * A concreta implementa
 * Ela cumpre o contrato
 * Ela depende dos dados
 */
class PlanetasImpl implements Planetas {
  constructor(private servico: DataService) {}

  pegaPlanetas() {
    return this.servico.dependencia.planetas
  }
}

/**
 * Este é um registrador
 * Organiza dependências
 *
 * Responda as perguntas
 * 1. Quem vamos chamar?
 * 2. Quem devemos usar?
 * 3. E de quem precisa?
 */
register(
  {
    for: Dependencia,
  },
  {
    for: DataService,
    add: [Dependencia],
  },
  {
    for: Planetas,
    use: PlanetasImpl,
    add: [DataService],
  }
)

class AppRoot extends HTMLElement {
  planetas = inject(Planetas)

  connectedCallback() {
    const select = document.createElement('select')

    this.planetas.pegaPlanetas().forEach((planeta) => {
      select.add(new Option(planeta, planeta))
    })

    this.append(select)

    console.dir(this.planetas)
  }
}

customElements.define('app-root', AppRoot)
