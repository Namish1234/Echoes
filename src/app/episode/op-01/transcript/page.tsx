'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const TRANSCRIPT = [
  { speaker: 'Iona', timestamp: '00:00', content: 'Welcome to The Opponents podcast. Today I have Vic Williamson with me — Team GB track cyclist, and one of the most remarkable stories I\'ve ever had the privilege of telling. Vic, welcome.' },
  { speaker: 'Vic', timestamp: '00:35', content: 'Thank you so much for having me. It\'s always a bit of an emotional one to tell, but I think it\'s important — so here we are.' },
  { speaker: 'Iona', timestamp: '01:20', content: 'Let\'s start at the beginning. You were recruited by British Cycling aged 16. How did that happen?' },
  { speaker: 'Vic', timestamp: '01:35', content: 'In 2009, I was on a talent ID programme run by British Cycling. I was the only successful applicant out of over 3,000 females. And it was actually my psychological aspects that gained me a place — my mindset, my competitiveness, my willingness to fight. Not physical, not power.' },
  { speaker: 'Iona', timestamp: '02:55', content: 'That\'s extraordinary — out of 3,000 women, they chose you for your mind. What did that feel like?' },
  { speaker: 'Vic', timestamp: '03:12', content: 'Honestly? At 16, I didn\'t fully understand the weight of it. I knew I was competitive — aggressively so. But the idea that that alone could get me into the GB system was... I didn\'t understand how rare that was until much later.' },
  { speaker: 'Iona', timestamp: '04:30', content: 'Walk me through your career before the crash — what were you competing in, what was the trajectory?' },
  { speaker: 'Vic', timestamp: '04:45', content: 'I was a track sprint cyclist. That\'s the short, incredibly explosive events on a velodrome — 200m, keirin, team sprint. I had been competing at international level, representing Great Britain, working my way up toward World Cup competition. We had the Olympics in our sights.' },
  { speaker: 'Iona', timestamp: '06:10', content: 'And then January the 9th, 2016. Rotterdam. Tell me what happened.' },
  { speaker: 'Vic', timestamp: '06:30', content: 'It was a Six Day event in Rotterdam. I was racing match sprint, which is a head-to-head race on a 200 metre track — very steeply banked, 43 degree banking. I was in the last bend, and I collided with a Dutch rider. We hooked wheels at speed. And that was it. I went into the fencing at full race speed.' },
  { speaker: 'Iona', timestamp: '07:45', content: 'What do you actually remember from the moment of impact?' },
  { speaker: 'Vic', timestamp: '08:00', content: 'Very little. I remember the sensation of the banking, and then nothing. I woke up on the track after however long I was out. What I found out later was that the medics — the Dutch medics on site — actually pitched a tent around me. They assumed I had not survived. The crowd went quiet. The tent went up.' },
  { speaker: 'Iona', timestamp: '08:55', content: 'God. And the extent of the injuries?' },
  { speaker: 'Vic', timestamp: '09:10', content: 'Broken neck. Broken back. Broken pelvis. And I was, they told me, just 2 millimetres from being completely paralysed for life. 2 millimetres.' },
  { speaker: 'Iona', timestamp: '09:40', content: 'Two millimetres. That is an almost incomprehensible margin. What happened immediately after — the surgeons, the decisions?' },
  { speaker: 'Vic', timestamp: '10:00', content: 'The Dutch surgeons wanted to put a halo brace in — they drill it directly into your skull to immobilise the broken neck. And I refused. Even lying there in a state I can barely describe, I refused. My surgeon back in the UK agreed. Because a halo brace would have removed all rotational movement in my neck, which means I could never ride on a velodrome again. His decision was to do the absolute minimum — brace it, don\'t fuse it — and that left the door open.' },
  { speaker: 'Iona', timestamp: '11:30', content: 'And you wore that brace for how long?' },
  { speaker: 'Vic', timestamp: '11:38', content: 'Six to nine months. Twenty-four hours a day. Sleeping in it. Driving in it. Eating in it. Never off.' },
  { speaker: 'Iona', timestamp: '12:15', content: 'What was the mental state in those early weeks? You\'re in the hospital, you\'ve been through fentanyl withdrawals, you can barely move...' },
  { speaker: 'Vic', timestamp: '12:30', content: 'Honestly, a blur. The fentanyl makes those first weeks very hazy. And there were moments — I won\'t pretend otherwise — where it was incredibly dark. But I think my personality, that competitive stubbornness, just wouldn\'t let me dwell there too long. I remember thinking: this is a problem to be solved.' },
  { speaker: 'Iona', timestamp: '14:00', content: 'How long before you started thinking about getting back on a bike?' },
  { speaker: 'Vic', timestamp: '14:15', content: 'Immediately. Genuinely. Even in hospital with a broken neck, I was asking about timelines. People thought I was in denial. Maybe I was. But I think that\'s also what kept me sane.' },
  { speaker: 'Iona', timestamp: '15:40', content: 'You mentioned Bishop — the intensive rehab unit. Tell me about arriving there.' },
  { speaker: 'Vic', timestamp: '15:55', content: 'So Bishop — officially called Bisham Abbey — is an elite sports rehab facility. James Moore, who led my programme, had a 3-to-1 staff-to-athlete ratio. That level of focus is extraordinary. And James very quickly laid out on a whiteboard what he called "Project Silverback." That was the name of my comeback mission.' },
  { speaker: 'Iona', timestamp: '17:10', content: 'Project Silverback. And what were the actual KPIs — what did you have to hit?' },
  { speaker: 'Vic', timestamp: '17:25', content: '125 kilogram back squat. 170 kilogram single-leg leg press. 1,500 watts on the bike — which is your peak power, relative to body weight. I was just under 65 kilos at the time. Those were the markers British Cycling set: hit those by January, or the funding gets cut.' },
  { speaker: 'Iona', timestamp: '18:30', content: 'How long had you been without training when you started at Bishop?' },
  { speaker: 'Vic', timestamp: '18:40', content: 'Eighteen months. Eighteen months of no strength training, no power work, nothing. Complete muscle wastage. And then they ask you to hit a 125 kilogram back squat.' },
  { speaker: 'Iona', timestamp: '20:00', content: 'But there was a setback even during Project Silverback — the screws cracked?' },
  { speaker: 'Vic', timestamp: '20:15', content: 'Yes. October or November, when I was building toward those targets — I started having real pain. Bruising coming through the skin. Got a scan. My bones had become so dense from the rehab loading that they were actually stronger than the titanium screws holding my spine together. The screws were cracking under the force. And the physios said: they need to come out. Now. But British Cycling said: the deadline doesn\'t move. Those were two very conflicting pressures.' },
  { speaker: 'Iona', timestamp: '22:00', content: 'And you chose to have the surgery?' },
  { speaker: 'Vic', timestamp: '22:10', content: 'Yes. Against what British Cycling wanted. James Moore\'s recommendation was clear: take them out. My gut said the same. So I had the screw removal surgery, got stapled back up, and was back at Bishop within a week. Back squatting with the staples still in my back.' },
  { speaker: 'Iona', timestamp: '23:30', content: 'You were squatting with staples in your spine.' },
  { speaker: 'Vic', timestamp: '23:38', content: 'James Moore was on a mission. We all were. The whole team. And I trusted that environment completely.' },
  { speaker: 'Iona', timestamp: '25:00', content: 'Come January — what happened?' },
  { speaker: 'Vic', timestamp: '25:10', content: 'I hit the targets. [laughter] Every single one. I rolled back up to British Cycling in January 2018. And I always remember the number — 752 days. It was exactly 752 days from the day of the crash to the day I got back on the velodrome. I still remember thinking "don\'t fall off now."' },
  { speaker: 'Iona', timestamp: '26:20', content: 'What did that first lap feel like?' },
  { speaker: 'Vic', timestamp: '26:30', content: 'Even if nothing else had come after that — even if I\'d never raced again — that lap made everything worth it. All of it. The tent, the fentanyl, the screws, the 5am sessions. That one slow lap around the velodrome.' },
  { speaker: 'Iona', timestamp: '31:00', content: 'Do you look back on everything differently now — do you regret the crash?' },
  { speaker: 'Vic', timestamp: '31:15', content: 'I don\'t regret the crash. That sounds insane to say. But I wouldn\'t be as rounded a human as I am now without it. I think about life differently. I value things differently. And I\'ve built a level of resilience I genuinely don\'t think I could have learned any other way.' },
  { speaker: 'Iona', timestamp: '34:45', content: 'If you had to give three pieces of advice to someone facing a long, brutal rehab process — what would they be?' },
  { speaker: 'Vic', timestamp: '35:04', content: 'First: plan. Have a plan, get the right people behind the plan, and trust it even when it falls apart. Second: protect your mindset as much as your body. I genuinely believe my mind carried me above where my body was capable of. The physical deficits are temporary — the mindset is everything. Third: take action. Be proactive. Don\'t let these moments define you. Use it, and let it refine you as opposed to define you.' },
  { speaker: 'Iona', timestamp: '38:00', content: 'That last line — "use it and let it refine you" — where does that come from inside you?' },
  { speaker: 'Vic', timestamp: '38:15', content: 'I think I\'ve always been someone who, if given a problem, looks for the solution rather than staring at the problem. The comparison trap is real — comparison is the thief of joy — and I\'ve been caught in it. But ultimately, every time I came back from that, it was by refocusing on what I could control and what I wanted to build. Not what I\'d lost.' },
  { speaker: 'Iona', timestamp: '40:30', content: 'Vic — thank you. This has been one of the most powerful conversations I\'ve ever had. You are extraordinary.' },
  { speaker: 'Vic', timestamp: '40:45', content: 'Thank you. I hope it helps someone. That\'s honestly why I tell it.' },
];

export default function Op01Transcript() {
  const [filter, setFilter] = useState<'All' | 'Vic' | 'Iona'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = TRANSCRIPT.filter(entry => {
    const matchSpeaker = filter === 'All' || entry.speaker === filter;
    const matchSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSpeaker && matchSearch;
  });

  return (
    <div className="w-full min-h-screen relative" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--text-primary)' }}>
      {/* Sports grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(to right, var(--text-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--text-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      {/* Cyan top stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#00E5FF] z-50"></div>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-24 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <Link href="/episode/op-01" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-6 opacity-50 hover:opacity-100 hover:text-[#00E5FF] transition-all" style={{ color: 'var(--text-primary)' }}>
            ← Back to Episode
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-black uppercase tracking-widest bg-[#00E5FF] text-black border-2 border-black shadow-[2px_2px_0px_#000]">Full Transcript</span>
            <span className="text-xs font-bold uppercase tracking-wider opacity-50" style={{ color: 'var(--text-muted)' }}>{TRANSCRIPT.length} segments</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Vic Williamson
          </h1>
          <p className="text-lg font-bold opacity-60" style={{ color: 'var(--text-secondary)' }}>A Devastating Cycling Accident &amp; Extraordinary Comeback Mission</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 sticky top-4 z-20">
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm font-bold border-2 outline-none focus:border-[#00E5FF] transition-colors"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-2">
            {(['All', 'Vic', 'Iona'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-4 py-2.5 text-xs font-black uppercase tracking-widest border-2 transition-all"
                style={{
                  backgroundColor: filter === s ? '#00E5FF' : 'var(--surface)',
                  borderColor: filter === s ? '#000' : 'var(--border-color)',
                  color: filter === s ? '#000' : 'var(--text-primary)',
                  boxShadow: filter === s ? '2px 2px 0px #000' : 'none',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Transcript entries */}
        <div className="space-y-0">
          {filtered.length === 0 && (
            <div className="text-center py-16 opacity-40 font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              No results found.
            </div>
          )}
          {filtered.map((entry, i) => (
            <div
              key={i}
              className={`flex gap-5 py-6 border-b transition-colors group ${i % 2 === 0 ? '' : ''}`}
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {/* Speaker + Timestamp */}
              <div className="shrink-0 w-28 pt-0.5">
                <div
                  className="text-xs font-black uppercase tracking-widest mb-1 px-2 py-0.5 inline-block"
                  style={{
                    backgroundColor: entry.speaker === 'Vic' ? '#EAB308' : '#00E5FF',
                    color: '#000',
                  }}
                >
                  {entry.speaker}
                </div>
                <div className="text-[10px] font-bold opacity-40 mt-1 tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {entry.timestamp}
                </div>
              </div>
              {/* Content */}
              <p className="text-base leading-relaxed flex-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                {entry.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t-4 border-[#00E5FF] flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--text-muted)' }}>
            The Opponents Podcast · Episode 01
          </p>
          <Link href="/episode/op-01" className="text-xs font-black uppercase tracking-widest text-[#00E5FF] hover:opacity-70 transition-opacity">
            ← Back to Episode
          </Link>
        </div>
      </div>
    </div>
  );
}
