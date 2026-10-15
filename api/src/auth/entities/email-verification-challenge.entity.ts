import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum VerificationPurpose {
  REGISTRATION = 'registration',
  EMAIL_CHANGE = 'email_change',
  PASSWORD_RESET = 'password_reset',
}

@Entity('email_verification_challenges')
@Index('IDX_challenge_user_purpose_created',['userId', 'purpose','createdAt'])
@Index('IDX_challenge_expiration', ['expiresAt'])
export class EmailVerificationChallenge {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'uuid'})
    userId: string;

    @ManyToOne(() => User, {
      nullable: false,
      onDelete: 'CASCADE'
    })
    @JoinColumn()
    user: User

    @Column({type:"enum", enum: VerificationPurpose, enumName: 'verification_purpose_enum'})
    purpose: VerificationPurpose;

    @Column({type: 'varchar', length: 320,nullable:true})
    targetEmail: string | null;

    @Column({length:64})
    codeHash: string;

    @Column({type:"int", default:0})
    attempts: number;

    @Column({type: 'timestamptz'})
    expiresAt: Date;

    @Column({type: "timestamptz", nullable:true})
    consumedAt: Date|null;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;
}