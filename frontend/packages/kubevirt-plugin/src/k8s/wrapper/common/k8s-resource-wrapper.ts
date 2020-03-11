/* eslint-disable lines-between-class-members */
import { getName, getNamespace, hasLabel, getLabels } from '@console/shared/src';
import { apiVersionForModel, K8sKind, K8sResourceKind } from '@console/internal/module/k8s';
import { Wrapper } from './wrapper';
import { K8sResourceKindMethods } from '../types/types';

export class K8sResourceWrapper<
  RESOURCE extends K8sResourceKind,
  SELF extends K8sResourceWrapper<RESOURCE, SELF>
> extends Wrapper<RESOURCE, SELF> implements K8sResourceKindMethods {
  getName = () => getName(this.data);
  getNamespace = () => getNamespace(this.data);
  getLabels = (defaultValue = {}) => getLabels(this.data, defaultValue);
  hasLabel = (label: string) => hasLabel(this.data, label);

  setModel = (model: K8sKind) => {
    this.data.kind = model.kind;
    this.data.apiVersion = apiVersionForModel(model);
    return (this as any) as SELF;
  };

  setName = (name: string) => {
    this.ensurePath('metadata');
    this.data.metadata.name = name;
    return (this as any) as SELF;
  };

  setNamespace = (namespace: string) => {
    this.ensurePath('metadata');
    this.data.metadata.namespace = namespace;
    return (this as any) as SELF;
  };

  addAnotation = (key: string, value: string) => {
    if (key) {
      this.ensurePath('metadata.annotations');
      this.data.metadata.annotations[key] = value;
    }
    return (this as any) as SELF;
  };

  addLabel = (key: string, value: string) => {
    if (key) {
      this.ensurePath('metadata.labels');
      this.data.metadata.labels[key] = value;
    }
    return (this as any) as SELF;
  };
}