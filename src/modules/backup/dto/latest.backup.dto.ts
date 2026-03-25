import { Expose } from "class-transformer";
import { BackupEntity } from "../domain";
import { ApiProperty } from "@nestjs/swagger";

export class LatestBackupDto {
    @ApiProperty()
    @Expose()
    deleted: BackupEntity;

    @ApiProperty()
    @Expose()
    latest: BackupEntity;

    @ApiProperty()
    @Expose()
    processing: BackupEntity;

}