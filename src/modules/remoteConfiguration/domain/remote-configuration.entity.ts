import { Entity } from 'typeorm';

import { Exclude } from 'class-transformer';

@Exclude()
@Entity()
export class RemoteConfigurationEntity {}
