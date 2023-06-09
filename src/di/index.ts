import type {
  Type,
  Provider,
  ProviderKey,
} from './types';

const container = new Map();
const relations = new Map();

export const inject = <T>(type: ProviderKey<T>): T => {
  const concrete = container.get(type);
  if (!concrete) throw `Provider ${type.name} não registrado`;
  return concrete;
};

const provide = <T>({ for: key, use }: Provider<T>) => {
  const concrete = use ?? key;
  if (typeof concrete === 'function') {
    const dependencies = relations.get(key);
    
    try {
      const clazz = concrete as Type<typeof use>;
      return new clazz(...dependencies) as T;
    } catch {
      const factory = concrete as <R>(...params: unknown[]) => R;
      return factory<T>(...dependencies);
    }
  }

  return concrete as T
};

const set = <T>(provider: Provider<T>) => {
  relations.set(provider.for, (provider.add ?? []).map(inject));
  const provided = provide(provider);
  container.set(provider.for, provided);
};

export const register = (...providers: Provider[]) => providers.forEach(set);

export default { inject, register };
