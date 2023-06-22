import { CoreEntity } from '../../commons/entities/core.entity';
import { Column, Entity } from 'typeorm';
import { SKILL_TYPE, SKILL_TYPE_SET } from '../../users/types/skill.type';
import { type } from 'os';

@Entity({ schema: process.env.DB_NAME })
export class Project extends CoreEntity {
    
    @Column({
        name: 'name',
        unique: true,
        comment: '프로젝트이름',
    })
    name: string;

    @Column({
        name: 'intro',
        nullable: false,
        comment: '프로젝트 소개',
    })
    intro: string;

    @Column({
        name: 'skills',
        nullable: false,
        comment: '프로젝트 주요 기술',
    })
    skills: SKILL_TYPE[];

    @Column({
        name: 'img_url',
        nullable: true,
        default: null,
        comment: '프로젝트이미지',
    })
    imgUrl: string;

    @Column({
        name: 'leader_id',
        nullable: false,
        comment: '팀장 ID',
    })
    leaderId: string;

    @Column({
        name: 'recruits_number',
        nullable: false,
        comment: '모집인원',
    })
    recruitsNumber: number;

    @Column({
        name: 'participants_number',
        nullable: false,
        comment: '참여인원',
        default: 1,
    })
    participantsNumber: number;

    @Column({
        name: 'completion_status',
        nullable: false,
        comment: '프로젝트 완료 여부',
        default: false,
    })
    completionStatus: boolean;

    @Column({
        name: 'period',
        nullable: false,
        comment: '프로젝트 기간',
    })
    period: string;

    @Column({
        name: 'field',
        nullable: false,
        comment: '프로젝트 분야',
    })
    field: string;

    @Column({
        name: 'type',
        nullable: false,
        comment: '프로젝트 형태',
    })
    type: string;

    @Column({
        name: 'post',
        nullable: false,
        comment: '게시글',
    })
    post: string;

}