import { CoreEntity } from '../../commons/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity({ schema: process.env.DB_NAME })
export class User extends CoreEntity {
  @Column({
    name: 'email',
    unique: true,
    comment: '이메일',
  })
  email: string;

  @Column({
    name: 'password',
    nullable: false,
    comment: '패스워드',
  })
  password: string;

  @Column({
    name: 'name',
    nullable: false,
    comment: '이름',
  })
  name: string;

  @Column({
    name: 'phone',
    nullable: false,
    comment: '연락처',
  })
  phone: string;

  @Column({
    name: 'kakao_auth_id',
    nullable: true,
    default: null,
    comment: '카카오 연동 로그인 아이디',
  })
  kakaoId: string;

  @Column({
    name: 'google_auth_id',
    nullable: true,
    default: null,
    comment: '구글 연동 로그인 아이디',
  })
  googleId: string;

  @Column({
    name: 'img_url',
    nullable: true,
    default: null,
    comment: '유저이미지',
  })
  img_url: string;

  @Column({
    name: 'field',
    type: 'simple-array',
    comment: '선호하는 분야',
  })
  fields: string[];

  @Column({
    name: 'tendency',
    type: 'simple-array',
    comment: '작업성향',
  })
  tendency: string[];

  @Column({
    name: 'position',
    comment: '포지션',
  })
  position: string;

  @Column({ name: 'intro', nullable: true, comment: '자기소개' })
  intro: string;

  @Column({
    type: 'set',
    name: 'skills',
    nullable: true,
    comment: '주요 스킬',
  })
  skills: string[];

  @Column({ name: 'like', comment: '좋아요수' })
  like: number;
}
