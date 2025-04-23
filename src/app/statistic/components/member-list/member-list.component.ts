// src/app/statistics/components/member-list/member-list.component.ts
import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Member } from '../../model/member.entity';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.statisticsService.getMembers().subscribe((data) => {
      this.members = data;
    });
  }
}
