import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Logger,
  Res,
  Patch,
} from '@nestjs/common';

import { AuthService } from 'auth/auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'auth/decorators/public.decorator';
import { CreateUserRequestDto } from 'users/dtos/requests/create-user-request.dto';
import { UsersService } from 'users/users.service';
import { LocalAuthGuard } from 'auth/guards/local-auth/local-auth.guard';
import RequestWithUser from 'auth/interfaces/request-with-user.interface';
import { Request, Response } from 'express';
import TokenPayload from 'auth/interfaces/token-payload.interface';
import { KakaoGuard } from 'auth/guards/kakao/kakao.guard';
import { GoogleGuard } from 'auth/guards/google/google.guard';
import { ConfigService } from '@nestjs/config';
import { ResetPassword } from 'auth/decorators/reset-password.decorator';
import { UpdatePasswordRequestDto } from 'auth/dtos/requests/update-password-request.dto';

@ApiTags('공통 API')
@Controller()
export class AppController {
  private REFRESH_TOKEN_EXPIRATION: number;
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    this.REFRESH_TOKEN_EXPIRATION = this.configService.get(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }

  private readonly logger = new Logger(AppController.name);
  @Public()
  @Get()
  getHello(): string {
    return 'hello';
  }

  /**
   * 회원가입 API
   * URL: /api/join
   */
  @Public()
  @Post('/join')
  @ApiOperation({
    summary: '회원가입 API',
    description: '일반 회원가입',
  })
  async generateNewUser(@Body() dto: CreateUserRequestDto) {
    const newUser = await this.userService.createUser(dto);
    return newUser;
  }

  /**
   *
   * 일반: 로그인
   * URL: /api/sign-in
   */
  @ApiOperation({
    summary: '일반 로그인 API',
    description: '일반 email/password 입력하여 로그인',
  })
  @Post('/sign-in')
  @Public()
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;

    // 헤더에 Bearer Token 형태로 응답
    const tokens = await this.authService.signIn(user.userId, user.email);

    // 유저아이디를 쿠키에 저장
    response.cookie('user_id', user.userId, {
      maxAge: this.REFRESH_TOKEN_EXPIRATION,
      httpOnly: true,
      secure: true,
    });
    return response.json(tokens);
  }

  /** 로그아웃 */
  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그아웃 - 액세스토큰/리프래시토큰 모두 삭제됨',
  })
  @Get('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    const { userId } = request.user;
    await this.authService.logOut(userId);

    // 쿠키삭제
    response.cookie('user_id', null, {
      maxAge: 0,
      httpOnly: true,
      secure: true,
    });
    return response.json();
  }

  /**
   * refresh 토큰으로 액세스토큰 재발급
   * - 토큰이 존재하면, key값에 대한 액세스 토큰을 재발급하여 레디스에 저장...
   */
  @ApiOperation({
    summary: '리프래시 토큰 API',
    description: '액세스 토큰 갱신',
  })
  @Public()
  @Get('refresh')
  async refreshAccessToken(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    // 쿠키에서 리프래시토큰과 유저아이디를 얻는다.
    const { user_id, refreshToken } = request.cookies;

    const tokens = await this.authService.refreshAccessToken({
      userId: user_id,
      refreshToken,
    });

    const user = await this.userService.findOneUser({
      userId: user_id,
      allowPassword: false,
    });
    this.logger.log(user.email);

    return response.json(tokens);
  }

  /**
   * 마이페이지
   * URL: /api/mypage
   *
   * - 내가 작성한 댓글 & 답글
   * - 내가 참여한 프로젝트
   * - 내가 완료한 프로젝트
   * - 내가 받은 프로젝트 제안
   * - 내가 생성한 프로젝트
   * - 내가 작성한 전시물
   *
   */
  @Get('/mypage')
  @ApiOperation({
    summary: '마이페이지 API',
    description: '로그인 유저 마이페이지',
  })
  async getMyPage(@Req() request: RequestWithUser) {
    return request.user;
  }

  /**
   *
   * sns: 카카오 연동 로그인
   * URL: /api/sign-in/kakao
   */
  @ApiOperation({
    summary: '카카오 연동 로그인 API',
    description: '카카오 연동 로그인',
  })
  @Get('/sign-in/kakao')
  @Public()
  @UseGuards(KakaoGuard)
  async signInByKakao(@Req() req: Request, @Res() res: Response) {
    return;
  }

  // 카카오로그인 리다이랙트
  @ApiOperation({
    summary: '카카오 연동 로그인 리다이렉트',
    description: '카카오 연동 로그인 리다이렉트',
  })
  @Get('/oauth/kakao')
  @Public()
  @UseGuards(KakaoGuard)
  async redirectKakao(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;

    const tokens = await this.authService.signIn(user.userId, user.email);

    // 리프래시토큰과 유저아이디를 쿠키에 저장
    res.cookie('user_id', user.userId, {
      maxAge: this.REFRESH_TOKEN_EXPIRATION,
      httpOnly: true,
      secure: true,
    });
    return res.json(tokens);
  }

  /**
   *
   * sns: gmail 연동 로그인
   * URL: /api/sign-in/google
   */
  @ApiOperation({
    summary: '구글 연동 로그인 API',
    description: '구글 연동 로그인',
  })
  @Get('/sign-in/google')
  @Public()
  @UseGuards(GoogleGuard)
  async signInByGoogle(@Req() request: RequestWithUser) {
    return;
  }

  // 구글로그인 리다이렉트
  @ApiOperation({
    summary: '구글 연동 로그인 리다이렉트',
    description: '구글 연동 로그인 리다이렉트',
  })
  @Get('oauth/google')
  @Public()
  @UseGuards(GoogleGuard)
  async redirectGoogle(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const { user } = request;
    const tokens = await this.authService.signIn(user.userId, user.email);

    // 리프래시토큰과 유저아이디를 쿠키에 저장
    response.cookie('user_id', user.userId, {
      maxAge: this.REFRESH_TOKEN_EXPIRATION,
      httpOnly: true,
      secure: true,
    });

    return response.json(tokens);
  }

  @ResetPassword()
  @Patch('password')
  async updatePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: UpdatePasswordRequestDto,
  ) {
    // 패스워드를 변경한다.
    await this.authService.updatePassword(dto);
    // 메인화면으로 돌아간다
    return res.status(302).redirect(``);
  }
}
